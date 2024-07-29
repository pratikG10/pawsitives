import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState(null); // Initialize users state as null
  const showToast = useShowToast();

  const getUserProfiles = async (usernamePrefix) => {
    setIsLoading(true);
    setUsers(null); // Reset users state when performing a new search
    try {
      const lowercasedUsernamePrefix = usernamePrefix.toLowerCase();
      const q = query(
        collection(firestore, "users"),
        where("username", ">=", lowercasedUsernamePrefix),
        where("username", "<=", lowercasedUsernamePrefix + "\uf8ff"),
        limit(7)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        showToast("Error", "No users found", "error");
        return false;
      }

      const fetchedUsers = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push(doc.data());
      });
      setUsers(fetchedUsers);
      return true;
    } catch (error) {
      showToast("Error", error.message, "error");
      setUsers(null); // Reset users state in case of error
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getUserProfiles, users, setUsers };
};

export default useSearchUser;
