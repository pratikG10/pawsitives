// src/pages/Chat/Message.jsx
import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import UserList from "../../componentes/Chat/UserList";
import ChatWindow from "../../componentes/Chat/ChatWindow";

const Message = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Flex>
      <Box w="25%" p={2}>
        <UserList onSelectUser={setSelectedUser} />
      </Box>
      <Box w="75%" p={2}>
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} />
        ) : (
          <div>Select a user to chat with</div>
        )}
      </Box>
    </Flex>
  );
};

export default Message;
