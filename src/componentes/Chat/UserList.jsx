// src/components/Chat/UserList.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(
        collection(firestore, "users"),
        where("hasChatted", "==", true)
      ); // Adjust your query as needed
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.uid} onClick={() => onSelectUser(user)}>
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default UserList;
