import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewMedia = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const showToast = useShowToast();
  const maxFileSizeInBytes = 50 * 1024 * 1024; // 50MB for videos

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      if (file.size > maxFileSizeInBytes) {
        showToast("Error", "File size must be less than 50MB", "error");
        setSelectedFile(null);
        return;
      }

      setFileType(fileType);

      if (fileType === "image") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFile(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (fileType === "video") {
        setSelectedFile(file);
      }
    } else {
      showToast("Error", "Please select a valid file", "error");
      setSelectedFile(null);
    }
  };

  return { selectedFile, fileType, handleMediaChange, setSelectedFile };
};

export default usePreviewMedia;
