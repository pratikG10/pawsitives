import {
  Box,
  Button,
  CloseButton,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Tooltip,
  useDisclosure,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { FiCamera } from "react-icons/fi";
import { FaSmile } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import usePreviewMedia from "../../hooks/usePreviewMedia";
import useShowToast from "../../hooks/useShowToast";
import useCreatePost from "../../hooks/useCreatePost";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [caption, setCaption] = useState("");
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const fileInputRef = useRef(null);
  const {
    handleMediaChange,
    selectedFile,
    fileType,
    setSelectedFile,
  } = usePreviewMedia();
  const showToast = useShowToast();
  const { isLoading, handleCreatePost } = useCreatePost();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handlePostCreation = async () => {
    try {
      await handleCreatePost(selectedFile, fileType, caption);
      onClose();
      setCaption("");
      setSelectedFile(null);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleEmojiSelect = (emoji) => {
    setCaption((prevCaption) => prevCaption + emoji.native);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = "auto"; // Reset the height to auto to recalculate
    const maxLines = 50;
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    const lines = Math.min(textarea.value.split("\n").length, maxLines);
    const newHeight = lineHeight * lines;
    textarea.style.height = `${newHeight}px`;
    if (textarea.scrollHeight > newHeight) {
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }
    setTextareaHeight(`${newHeight}px`);
  };

  // Hide emoji picker if clicking outside of it
  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Tooltip
        hasArrow
        label={"Create"}
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
          <FiCamera size={"25px"} />
          <Box display={{ base: "none", md: "block" }}>Post Media</Box>
        </Flex>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent bg="#242124" color="white">
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={handleCaptionChange}
              style={{ height: textareaHeight }}
              overflow="hidden"
              bg="black"
              color="white"
            />
            <Flex justifyContent="space-between" alignItems="center">
              <Button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                leftIcon={<FaSmile />}
                variant="ghost"
                color="white"
              >
                Add Emoji
              </Button>
              {showEmojiPicker && (
                <Box ref={emojiPickerRef}>
                  <Picker
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme="dark"
                  />
                </Box>
              )}
            </Flex>

            <Button
              onClick={handleFileInputClick}
              mt={2}
              colorScheme="blue"
              width="100%"
            >
              Select Media
            </Button>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {selectedFile && (
              <Box mt={4} pos="relative">
                <CloseButton
                  pos="absolute"
                  top={1}
                  right={1}
                  color="red.500"
                  onClick={() => setSelectedFile(null)}
                />
                {fileType === "image" ? (
                  <Image src={selectedFile} alt="Selected media" maxH="300px" />
                ) : (
                  <Box as="video" controls maxH="300px">
                    <source
                      src={URL.createObjectURL(selectedFile)}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </Box>
                )}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={isLoading}
              onClick={handlePostCreation}
              isDisabled={!selectedFile || isLoading}
            >
              Post
            </Button>
            <Button variant="ghost" onClick={onClose} color="white">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
