import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useUserProfileStore from "../store/userProfileStore";

const useEditProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

  const showToast = useShowToast();

  const editProfile = async (inputs, selectedFile) => {
    if (isUpdating || !authUser) return;
    setIsUpdating(true);

    const storageRef = ref(storage, `profilePics/${authUser.uid}`);
    const userDocRef = doc(firestore, "users", authUser.uid);

    let profilePicURL = authUser.profilePicURL;

    try {
      if (selectedFile) {
        await uploadString(storageRef, selectedFile, "data_url");
        profilePicURL = await getDownloadURL(storageRef);
      }

      const updatedUser = {
        ...authUser,
        fullname: inputs.fullname || authUser.fullname,
        username: inputs.username || authUser.username,
        bio: inputs.bio !== undefined ? inputs.bio : authUser.bio,
        link: inputs.link !== undefined ? inputs.link : authUser.link,
        profilePicURL: profilePicURL,
      };

      // Remove fields if they are empty strings
      if (updatedUser.bio === "") updatedUser.bio = "";
      if (updatedUser.link === "") updatedUser.link = "";

      await updateDoc(userDocRef, {
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        bio: updatedUser.bio,
        link: updatedUser.link,
        profilePicURL: updatedUser.profilePicURL,
      });

      localStorage.setItem("user-info", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);
      setUserProfile(updatedUser);

      showToast("Success", "Profile updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return { editProfile, isUpdating };
};

export default useEditProfile;
