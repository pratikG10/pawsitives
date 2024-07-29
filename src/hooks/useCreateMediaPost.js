import { useState } from "react";
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

const useCreateMediaPost = () => {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);

  const handleCreatePost = async (selectedFile, caption, mediaType) => {
    if (isLoading) return;
    if (!selectedFile) throw new Error(`Please select a ${mediaType}`);
    setIsLoading(true);

    const newPost = {
      caption: caption,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      createdBy: authUser?.uid,
      type: mediaType,
    };

    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      const userDocRef = doc(firestore, "users", authUser?.uid);
      const mediaRef = ref(
        storage,
        `${mediaType === "image" ? "posts" : "videos"}/${postDocRef.id}`
      );

      await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });

      if (mediaType === "image") {
        await uploadString(mediaRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(mediaRef);
        await updateDoc(postDocRef, { imageURL: downloadURL });
        newPost.imageURL = downloadURL;
      } else {
        const uploadTask = uploadBytesResumable(mediaRef, selectedFile);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload progress:", progress + "%");
          },
          (error) => {
            showToast("Error", error.message, "error");
            setIsLoading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(mediaRef);
            await updateDoc(postDocRef, { videoURL: downloadURL });
            newPost.videoURL = downloadURL;
            if (userProfile.uid === authUser.uid) {
              createPost({ ...newPost, id: postDocRef.id });
            }
            if (userProfile.uid === authUser.uid) {
              addPost({ ...newPost, id: postDocRef.id });
            }
            showToast(
              "Success",
              `${
                mediaType === "image" ? "Post" : "Video"
              } created successfully`,
              "success"
            );
          }
        );
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreatePost };
};

export default useCreateMediaPost;
