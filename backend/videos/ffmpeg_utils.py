import json
import subprocess
import os

def extract_video_metadata(file_path):
    """
    Extracts metadata from a video file using ffprobe.
    Returns a dictionary with duration, resolution, and file_size.
    """
    try:
        cmd = [
            "ffprobe",
            "-v", "quiet",
            "-print_format", "json",
            "-show_streams",
            "-show_format",
            file_path
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        data = json.loads(result.stdout)
        
        # Get video stream
        video_stream = next((stream for stream in data.get("streams", []) if stream.get("codec_type") == "video"), None)
        
        duration = float(data.get("format", {}).get("duration", 0))
        file_size = int(data.get("format", {}).get("size", 0))
        
        width = int(video_stream.get("width", 0)) if video_stream else 0
        height = int(video_stream.get("height", 0)) if video_stream else 0
        
        return {
            "duration": duration,
            "width": width,
            "height": height,
            "resolution": f"{width}x{height}" if width and height else None,
            "file_size": file_size
        }
    except Exception as e:
        print(f"Error extracting metadata from {file_path}: {e}")
        return {
            "duration": None,
            "width": None,
            "height": None,
            "resolution": None,
            "file_size": None
        }

def extract_thumbnail(video_path, output_path):
    """
    Extracts a thumbnail from a video at 1.0 seconds using ffmpeg.
    """
    try:
        cmd = [
            "ffmpeg",
            "-y",
            "-ss", "00:00:01.00",
            "-i", video_path,
            "-vframes", "1",
            "-q:v", "2",
            output_path
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return True
    except Exception as e:
        print(f"Error extracting thumbnail from {video_path}: {e}")
        return False

def transcode_video(video_path, output_path, target_height):
    """
    Transcodes a video to a target height resolution (e.g. 1080, 720, 480) using ffmpeg.
    """
    try:
        cmd = [
            "ffmpeg",
            "-y",
            "-i", video_path,
            "-vf", f"scale=-2:{target_height}",
            "-c:v", "libx264",
            "-crf", "23",
            "-preset", "medium",
            "-c:a", "aac",
            "-b:a", "128k",
            output_path
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return True
    except Exception as e:
        print(f"Error transcoding {video_path} to {target_height}p: {e}")
        return False

def extract_key_frames(video_path, output_dir, count=3):
    """
    Extracts a specified number of keyframes from a video at regular intervals using ffmpeg.
    """
    try:
        # First get duration
        metadata = extract_video_metadata(video_path)
        duration = metadata.get("duration") or 10.0
        
        interval = duration / (count + 1)
        os.makedirs(output_dir, exist_ok=True)
        
        extracted_paths = []
        for i in range(1, count + 1):
            timestamp = i * interval
            h = int(timestamp // 3600)
            m = int((timestamp % 3600) // 60)
            s = timestamp % 60
            time_str = f"{h:02d}:{m:02d}:{s:06.3f}"
            
            output_path = os.path.join(output_dir, f"frame_{i}.jpg")
            cmd = [
                "ffmpeg",
                "-y",
                "-ss", time_str,
                "-i", video_path,
                "-vframes", "1",
                "-q:v", "2",
                output_path
            ]
            subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
            if os.path.exists(output_path):
                extracted_paths.append(output_path)
        return extracted_paths
    except Exception as e:
        print(f"Error extracting keyframes from {video_path}: {e}")
        return []

def extract_audio_stream(video_path, output_audio_path):
    """
    Extracts the audio track from a video file as an MP3/WAV file using ffmpeg.
    """
    try:
        os.makedirs(os.path.dirname(output_audio_path), exist_ok=True)
        cmd = [
            "ffmpeg",
            "-y",
            "-i", video_path,
            "-vn",
            "-acodec", "libmp3lame",
            "-ar", "44100",
            "-ac", "2",
            "-ab", "192k",
            output_audio_path
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return os.path.exists(output_audio_path)
    except Exception as e:
        print(f"Error extracting audio from {video_path}: {e}")
        return False

