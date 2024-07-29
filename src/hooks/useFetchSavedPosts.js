import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";

const useFetchSavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!authUser) {
        setIsLoading(false);
        return;
      }

      try {
        const userDocRef = doc(firestore, "users", authUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const savedPostsIds = userDocSnap.data().savedPosts || [];

          if (savedPostsIds.length > 0) {
            const postsQuery = query(
              collection(firestore, "posts"),
              where("__name__", "in", savedPostsIds)
            );
            const querySnapshot = await getDocs(postsQuery);

            const posts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            posts.sort((a, b) => b.createdAt - a.createdAt);
            setSavedPosts(posts);
          } else {
            setSavedPosts([]);
          }
        }
      } catch (err) {
        setError(err);
        showToast("Error", err.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPosts();
  }, [authUser, showToast]);

  return { savedPosts, isLoading, error };
};

export default useFetchSavedPosts;
