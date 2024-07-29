// src/utils/fetchPosts.js
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

export const fetchPosts = async () => {
  const postsCollection = collection(firestore, "posts");
  const postsSnapshot = await getDocs(postsCollection);
  const postsList = postsSnapshot.docs.map((doc) => doc.data());
  return postsList;
};
