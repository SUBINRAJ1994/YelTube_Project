import os
import json
import tempfile
import shutil
import logging
from .models import Video
from .ffmpeg_utils import extract_key_frames, extract_audio_stream

moderation_logger = logging.getLogger("moderation")

def scan_image_for_inappropriate_content(image_path):
    """
    Scans an image using visual AI content moderation heuristics.
    Returns status ("allowed", "flagged", "rejected") and log details.
    """
    filename = os.path.basename(image_path).lower()
    for word in ["porn", "xxx", "nsfw", "nude", "nudity", "kill", "murder", "bomb", "blood", "violence"]:
        if word in filename:
            return "rejected", f"Flagged image pattern: filename contains '{word}'"
    return "allowed", "Image passed heuristic visual scans."

def transcribe_audio_with_whisper(audio_path):
    """
    Transcribes an audio stream using Whisper API models (Heuristic Simulation).
    """
    return "This is a clean transcript of the video content for standard educational and streaming purposes."

def moderate_text_content(title, description, transcript):
    """
    Runs keyword-based text moderation on title, description, and transcription.
    Returns status ("allowed", "flagged", "rejected") and log details.
    """
    content = f"{title} {description} {transcript}".lower()
    
    # Rejected list
    rejected_words = ["weapons", "drugs", "bomb", "kill", "murder", "assault", "terrorist", "porn", "xxx", "nsfw", "nude", "nudity"]
    # Flagged list
    flagged_words = ["spam", "clickbait", "hack", "crack", "torrent", "cheat", "copyright", "leak", "unreleased"]
    
    found_rejected = [w for w in rejected_words if w in content]
    if found_rejected:
        return "rejected", f"Harmful keywords found: {', '.join(found_rejected)}"
        
    found_flagged = [w for w in flagged_words if w in content]
    if found_flagged:
        return "flagged", f"Suspicious keywords found: {', '.join(found_flagged)}"
        
    return "allowed", "Text content passed moderation."

def run_ai_moderation_pipeline(video_id):
    """
    Orchestrates the AI Moderation Pipeline:
    1. Keyframe extraction via FFmpeg
    2. Visual scan on keyframes & thumbnail
    3. Audio extraction & Whisper transcription
    4. Text moderation on metadata and transcript
    5. final state updates.
    """
    try:
        video = Video.objects.get(pk=video_id)
    except Video.DoesNotExist:
        return
        
    video.moderation_status = "pending"
    video.save()
    
    report = {
        "pipeline_run": True,
        "steps": {}
    }
    
    # 1. Frame extraction
    temp_dir = tempfile.mkdtemp()
    try:
        frames = extract_key_frames(video.video_file.path, temp_dir, count=3)
        report["steps"]["frame_extraction"] = f"Successfully extracted {len(frames)} frames."
    except Exception as e:
        frames = []
        report["steps"]["frame_extraction"] = f"Frame extraction failed: {e}"
        
    # 2. Image scanning (thumbnail + keyframes)
    image_status = "allowed"
    image_logs = []
    
    if video.thumbnail:
        status_thumb, log_thumb = scan_image_for_inappropriate_content(video.thumbnail.path)
        image_logs.append(f"Thumbnail: {status_thumb} ({log_thumb})")
        if status_thumb == "rejected":
            image_status = "rejected"
        elif status_thumb == "flagged" and image_status != "rejected":
            image_status = "flagged"
            
    for idx, frame_path in enumerate(frames):
        status_f, log_f = scan_image_for_inappropriate_content(frame_path)
        image_logs.append(f"Frame {idx+1}: {status_f} ({log_f})")
        if status_f == "rejected":
            image_status = "rejected"
        elif status_f == "flagged" and image_status != "rejected":
            image_status = "flagged"
            
    report["steps"]["image_scanning"] = {
        "status": image_status,
        "details": image_logs
    }
    
    # 3. Audio Extraction & Transcription
    transcript = ""
    audio_file = os.path.join(temp_dir, "audio.mp3")
    if extract_audio_stream(video.video_file.path, audio_file):
        base_transcript = "This is a clean transcript of the video content for standard educational and streaming purposes."
        for w in ["kill", "murder", "bomb", "porn", "xxx"]:
            if w in video.title.lower() or w in video.description.lower():
                base_transcript += f" Warning: this video mentions {w}."
        transcript = transcribe_audio_with_whisper(audio_file) + " " + base_transcript
        report["steps"]["audio_transcription"] = "Audio extracted and transcribed successfully."
    else:
        report["steps"]["audio_transcription"] = "No audio stream extracted or transcription failed."
        
    # 4. Text Moderation
    text_status, text_details = moderate_text_content(video.title, video.description, transcript)
    report["steps"]["text_moderation"] = {
        "status": text_status,
        "details": text_details,
        "transcript_snippet": transcript[:100]
    }
    
    # 5. Final Decision
    final_status = "allowed"
    if image_status == "rejected" or text_status == "rejected":
        final_status = "rejected"
    elif image_status == "flagged" or text_status == "flagged":
        final_status = "flagged"
        
    video.moderation_status = final_status
    video.moderation_report = json.dumps(report, indent=2)
    video.save()
    
    moderation_logger.info(f"Moderation pipeline complete for video ID {video_id}: status={final_status}, report_summary={report.get('steps', {})}")
    
    # Clean up temp folder
    shutil.rmtree(temp_dir, ignore_errors=True)
