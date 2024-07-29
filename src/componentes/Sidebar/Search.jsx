import {
  Box,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import useSearchUser from "../../hooks/useSearchUser";
import SuggestUser from "../suggest/SuggestUser";
import { useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

const Search = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchRef = useRef(null);
  const { users, isLoading, getUserProfiles } = useSearchUser();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSearchUser = async (usernamePrefix) => {
    setErrorMessage(""); // Reset error message
    if (usernamePrefix.trim() === "") {
      setErrorMessage("Please enter a username to search.");
      return;
    }
    const success = await getUserProfiles(usernamePrefix);
    if (!success) {
      setErrorMessage("No users found.");
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => handleSearchUser(value), 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleUserClick = (username) => {
    onClose(); // Close the modal
    navigate(`/${username}`); // Navigate to the user profile
  };

  return (
    <>
      <Tooltip
        hasArrow
        label={"Search"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}
      >
        <Flex
          alignItems={"center"}
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          onClick={onOpen}
        >
          <SearchLogo />
          <Box display={{ base: "none", md: "block" }}>Search</Box>
        </Flex>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
        <ModalOverlay />
        <ModalContent bg={"black"} border={"1px solid #301934"} maxW={"500px"}>
          <ModalHeader>Search user</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder="find your friends..."
                ref={searchRef}
                onChange={handleInputChange}
              />
            </FormControl>
            {errorMessage && (
              <Box color="red.500" mt={4}>
                {errorMessage}
              </Box>
            )}
            {users !== null && users.length > 0 && (
              <VStack spacing={4} mt={4} align="start" w="full">
                {users.map((user) => (
                  <Box
                    key={user.username}
                    p={2}
                    bg="black.100"
                    borderRadius="md"
                    w="full"
                    _hover={{ bg: "gray.900" }}
                    onClick={() => handleUserClick(user.username)} // Close modal and navigate
                  >
                    <SuggestUser user={user} />
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Search;
