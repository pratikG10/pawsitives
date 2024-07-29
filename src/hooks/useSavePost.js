import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";

const useSavePost = (post) => {
  const [isSaved, setIsSaved] = useState(false);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!authUser) return;
      const userDocRef = doc(firestore, "users", authUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const savedPosts = userDocSnap.data().savedPosts || [];
        setIsSaved(savedPosts.includes(post.id));
      }
    };

    checkIfSaved();
  }, [authUser, post.id]);

  const handleSavePost = async () => {
    if (!authUser) return;
    const userDocRef = doc(firestore, "users", authUser.uid);
    if (isSaved) {
      await updateDoc(userDocRef, {
        savedPosts: arrayRemove(post.id),
      });
      setIsSaved(false);
    } else {
      await updateDoc(userDocRef, {
        savedPosts: arrayUnion(post.id),
      });
      setIsSaved(true);
    }
  };

  return { handleSavePost, isSaved };
};

export default useSavePost;
