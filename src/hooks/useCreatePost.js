import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../firebase/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "../hooks/useShowToast";

const useCreatePost = () => {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const { pathname } = useLocation();

  const handleCreatePost = async (selectedFile, fileType, caption) => {
    if (isLoading) return;
    if (!selectedFile) throw new Error("Please select a file");
    setIsLoading(true);

    const newPost = {
      caption,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      createdBy: authUser.uid,
    };

    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      const userDocRef = doc(firestore, "users", authUser.uid);

      let downloadURL = "";
      if (fileType === "image") {
        const imageRef = ref(storage, `posts/${postDocRef.id}`);
        await uploadString(imageRef, selectedFile, "data_url");
        downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, { imageURL: downloadURL });
        newPost.imageURL = downloadURL;
      } else if (fileType === "video") {
        const videoRef = ref(storage, `posts/${postDocRef.id}`);
        const uploadTask = uploadBytesResumable(videoRef, selectedFile);
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              reject(error);
            },
            async () => {
              downloadURL = await getDownloadURL(videoRef);
              await updateDoc(postDocRef, { videoURL: downloadURL });
              resolve();
            }
          );
        });
        newPost.videoURL = downloadURL;
      }

      await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });

      if (userProfile.uid === authUser.uid)
        createPost({ ...newPost, id: postDocRef.id });

      if (pathname !== "/" && userProfile.uid === authUser.uid)
        addPost({ ...newPost, id: postDocRef.id });

      showToast("Success", "Post created successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreatePost };
};

export default useCreatePost;
