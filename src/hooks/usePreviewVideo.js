import { useState } from "react";

const usePreviewVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedVideo(file);
    } else {
      setSelectedVideo(null);
    }
  };

  return {
    selectedVideo,
    setSelectedVideo,
    handleVideoChange,
  };
};

export default usePreviewVideo;
