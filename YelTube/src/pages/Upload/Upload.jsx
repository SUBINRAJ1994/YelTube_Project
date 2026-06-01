import { useState } from "react";
import "./Upload.css";

const Upload = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [uploading, setUploading] =
    useState(false);

  const [category, setCategory] =
    useState("");

  const [videoFile, setVideoFile] =
    useState(null);

  const [thumbnail, setThumbnail] =
    useState(null);

  const [videoPreview, setVideoPreview] =
    useState("");

  const [thumbnailPreview,
    setThumbnailPreview] =
    useState("");

  const handleUpload = () => {

    if (
      !title ||
      !description ||
      !videoFile ||
      !thumbnail ||
      !category
    ) {
      alert("Please fill all fields");
      return;
    }

    if (
      !videoFile.type.startsWith("video/")
    ) {
      alert("Please select a valid video");
      return;
    }

    if (
      !thumbnail.type.startsWith("image/")
    ) {
      alert("Please select a valid image");
      return;
    }

    if (
      videoFile.size > 50000000
    ) {
      alert("Video size must be below 50MB");
      return;
    }

    setUploading(true);

    let progress = 0;

    const interval = setInterval(() => {

      progress += 1;

      setUploadProgress(progress);

      if (progress >= 100) {

        clearInterval(interval);

        setUploading(false);

        alert("Upload Successful");

        setTimeout(() => {
          setUploadProgress(0);
        }, 2000);

      }

    }, 100);

  };

  const isLoggedIn =
    localStorage.getItem("isLoggedIn","true");

  if (!isLoggedIn) {

    return (

      <div className="upload-page">

        <h2>
          Please Login First
        </h2>

      </div>

    );

  }

  return (

    <div className="upload-page">

      <div className="upload-container">

        <h2>
          Upload Video
        </h2>

        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="">
            Select a category
          </option>

          <option>
            Film & Animation
          </option>

          <option>
            Autos & Vehicles
          </option>

          <option>
            Music
          </option>

          <option>
            Pets & Animals
          </option>

          <option>
            Sports
          </option>

          <option>
            Travel & Events
          </option>

          <option>
            Gaming
          </option>

          <option>
            People & Blogs
          </option>

          <option>
            Comedy
          </option>

          <option>
            Entertainment
          </option>

          <option>
            News & Politics
          </option>

          <option>
            Howto & Style
          </option>

          <option>
            Education
          </option>

          <option>
            Science & Technology
          </option>

          <option>
            Nonprofits & Activism
          </option>

          <option>
            Live
          </option>

          <option>
            Shorts
          </option>

          <option>
            Podcast
          </option>

          <option>
            Tutorial
          </option>

          <option>
            Programming
          </option>

          <option>
            Cooking
          </option>

          <option>
            Fitness
          </option>

          <option>
            Fashion
          </option>

          <option>
            Photography
          </option>

          <option>
            Motivation
          </option>

          <option>
            Business
          </option>

          <option>
            Finance
          </option>

          <option>
            Kids
          </option>

          <option>
            Documentary
          </option>

          <option>
            Anime
          </option>

          <option>
            Malayalam
          </option>

          <option>
            Tamil
          </option>

          <option>
            Hindi
          </option>

          <option>
            English
          </option>

        </select>

        <label>
          Upload Video
        </label>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => {

            const file =
              e.target.files[0];

            if (!file) return;

            setVideoFile(file);

            setVideoPreview(
              URL.createObjectURL(file)
            );

          }}
        />

        {
          videoPreview && (

            <video
              src={videoPreview}
              controls
              className="video-preview"
            />

          )
        }

        <label>
          Upload Thumbnail
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {

            const file =
              e.target.files[0];

            if (!file) return;

            setThumbnail(file);

            setThumbnailPreview(
              URL.createObjectURL(file)
            );

          }}
        />

        {
          thumbnailPreview && (

            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="thumbnail-preview"
            />

          )
        }

        <button
          onClick={handleUpload}
          disabled={uploading}
        >

          {
            uploading
              ? "Uploading..."
              : "Upload"
          }

        </button>

        {
          uploadProgress > 0 && (

            <div className="progress-container">

              <div
                className="progress-bar"
                style={{
                  width: `${uploadProgress}%`
                }}
              >

                {uploadProgress}%

              </div>

            </div>

          )
        }

      </div>

    </div>

  );

};

export default Upload;