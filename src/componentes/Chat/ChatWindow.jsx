// src/components/Chat/ChatWindow.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { firestore, auth, storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      const q = query(
        collection(firestore, "messages", selectedUser.uid, "chats"),
        orderBy("timestamp", "asc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = querySnapshot.docs.map((doc) => doc.data());
        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [selectedUser]);

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      await addDoc(
        collection(firestore, "messages", selectedUser.uid, "chats"),
        {
          text: newMessage,
          sender: auth.currentUser.uid,
          timestamp: new Date(),
        }
      );
      setNewMessage("");
    }
  };

  const sendFileMessage = async () => {
    if (file) {
      const fileRef = ref(storage, `chatFiles/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      await addDoc(
        collection(firestore, "messages", selectedUser.uid, "chats"),
        {
          fileUrl,
          sender: auth.currentUser.uid,
          timestamp: new Date(),
        }
      );
      setFile(null);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === auth.currentUser.uid ? "sent" : "received"
            }`}
          >
            {msg.text || (
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                View File
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={sendFileMessage}>Send File</button>
      </div>
    </div>
  );
};

export default ChatWindow;
