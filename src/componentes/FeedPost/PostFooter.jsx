import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useDisclosure,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Image,
  VStack,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CommentLogo,
  NotificationsLogo,
  UnlikeLogo,
} from "../../assets/constants";
import usePostComment from "../../hooks/usePostComment";
import useAuthStore from "../../store/authStore";
import useLikePost from "../../hooks/useLikePost";
import { timeAgo } from "../../utils/timeAgo";
import { FaRegShareSquare, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Comment from "../Comments/Comment";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs"; // Import filled bookmark icon
import useSavePost from "../../hooks/useSavePost"; // Custom hook for saving posts

const PostFooter = ({ post, isProfilePage, creatorProfile }) => {
  const { isCommenting, handlePostComment } = usePostComment();
  const [comment, setComment] = useState("");
  const authUser = useAuthStore((state) => state.user);
  const commentRef = useRef(null);
  const { handleLikePost, isLiked, likes } = useLikePost(post);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const navigate = useNavigate();
  const backgroundVideoRef = useRef(null);
  const modalVideoRef = useRef(null);

  const { handleSavePost, isSaved } = useSavePost(post); // Use custom hook for saving posts

  const handleSubmitComment = async () => {
    await handlePostComment(post.id, comment);
    setComment("");
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji) => {
    setComment((prevComment) => prevComment + emoji.native);
  };

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target) &&
      !commentRef.current.contains(event.target)
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

  const handleOpenModal = () => {
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.pause();
    }
    onOpen();
  };

  const handleCloseModal = () => {
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.play();
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      modalVideoRef.current.play();
    }
  }, [isOpen]);

  return (
    <Box mb={10} marginTop={"auto"} position="relative">
      <Flex alignItems={"center"} gap={4} w={"full"} pt={0} mb={2} mt={4}>
        <Box onClick={handleLikePost} cursor={"pointer"} fontSize={18}>
          {!isLiked ? <NotificationsLogo /> : <UnlikeLogo />}
        </Box>

        <Box cursor={"pointer"} fontSize={18} onClick={handleOpenModal}>
          <CommentLogo />
        </Box>

        <Box cursor={"pointer"} fontSize={20}>
          <FaRegShareSquare />
        </Box>

        <Flex justifyContent="flex-end" w="full">
          <Box fontSize={20} onClick={handleSavePost} cursor={"pointer"}>
            {isSaved ? <BsBookmarkFill /> : <BsBookmark />}{" "}
            {/* Show filled bookmark if saved */}
          </Box>
        </Flex>
      </Flex>
      <Text fontWeight={600} fontSize={"sm"}>
        {likes} likes
      </Text>

      {isProfilePage && (
        <Text fontSize="12" color={"gray"}>
          Posted {timeAgo(post.createdAt)}
        </Text>
      )}

      {!isProfilePage && (
        <>
          {post.comments.length > 0 && (
            <Text
              fontSize="sm"
              color={"gray"}
              cursor={"pointer"}
              onClick={handleOpenModal}
            >
              View all {post.comments.length} comments
            </Text>
          )}
        </>
      )}

      {authUser && (
        <Flex
          alignItems={"center"}
          gap={2}
          justifyContent={"space-between"}
          w={"full"}
        >
          <InputGroup>
            <InputLeftElement>
              <IconButton
                icon={<FaSmile />}
                marginRight={5}
                size="xl"
                variant="ghost"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                _hover={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
              />
            </InputLeftElement>
            <Input
              variant={"flushed"}
              placeholder={"Add a comment..."}
              fontSize={14}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              ref={commentRef}
              pl={10}
            />
            <InputRightElement>
              <Button
                fontSize={14}
                color={"blue.500"}
                fontWeight={600}
                cursor={"pointer"}
                bg={"transparent"}
                onClick={handleSubmitComment}
                isLoading={isCommenting}
                _hover={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
              >
                Post
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
      )}
      {showEmojiPicker && (
        <Box
          position="absolute"
          bottom="60px"
          right="0"
          zIndex="2"
          ref={emojiPickerRef}
        >
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </Box>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        isCentered={true}
        size={{ base: "3xl", md: "5xl" }}
      >
        <ModalOverlay />
        <ModalContent border={"1px solid #301934"}>
          <ModalCloseButton />
          <ModalBody bg={"black"} display="flex" flexDirection="column" p={6}>
            <Flex
              gap="4"
              w={{ base: "90%", sm: "70%", md: "full" }}
              mx={"auto"}
              maxH={"90vh"}
              minH={"50vh"}
            >
              <Flex
                borderRadius={4}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"whiteAlpha.300"}
                flex={1.5}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {post.videoURL ? (
                  <video
                    controls
                    src={post.videoURL}
                    ref={modalVideoRef}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Image src={post.imageURL} alt="profile post" />
                )}
              </Flex>
              <Flex
                flex={1}
                flexDir={"column"}
                px={10}
                display={{ base: "none", md: "flex" }}
                justifyContent="space-between"
              >
                <Box>
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Flex alignItems={"center"} gap={4}>
                      <Link to={`/${creatorProfile.username}`}>
                        <Avatar
                          src={creatorProfile.profilePicURL}
                          size={"sm"}
                          name={creatorProfile.username || "User"}
                        />
                      </Link>
                      <Text
                        fontWeight={"bold"}
                        fontSize={12}
                        onClick={() => navigate(`/${creatorProfile.username}`)}
                        cursor="pointer"
                      >
                        {creatorProfile.username}
                      </Text>
                    </Flex>
                  </Flex>
                  <Divider my={4} bg={"gray.500"} />

                  <VStack
                    w="full"
                    alignItems={"start"}
                    maxH={"350px"}
                    overflowY={"auto"}
                  >
                    {post.comments.map((comment) => (
                      <Comment key={comment.id} comment={comment} />
                    ))}
                  </VStack>
                </Box>
                {authUser && (
                  <Box mt={4}>
                    <Divider my={4} bg={"gray.8000"} />
                    <Flex
                      alignItems={"center"}
                      gap={2}
                      justifyContent={"space-between"}
                      w={"full"}
                    >
                      <InputGroup>
                        <InputLeftElement>
                          <IconButton
                            icon={<FaSmile />}
                            marginRight={5}
                            size="xl"
                            variant="ghost"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            _hover={{ bg: "transparent" }}
                            _active={{ bg: "transparent" }}
                          />
                        </InputLeftElement>
                        <Input
                          variant={"flushed"}
                          placeholder={"Add a comment..."}
                          fontSize={14}
                          onChange={(e) => setComment(e.target.value)}
                          value={comment}
                          ref={commentRef}
                          pl={10}
                        />
                        <InputRightElement>
                          <Button
                            fontSize={14}
                            color={"blue.500"}
                            fontWeight={600}
                            cursor={"pointer"}
                            bg={"transparent"}
                            onClick={handleSubmitComment}
                            isLoading={isCommenting}
                            _hover={{ bg: "transparent" }}
                            _active={{ bg: "transparent" }}
                          >
                            Post
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </Flex>
                    {showEmojiPicker && (
                      <Box
                        position="absolute"
                        bottom="60px"
                        right="0"
                        zIndex="2"
                        ref={emojiPickerRef}
                      >
                        <Picker
                          data={data}
                          onEmojiSelect={handleEmojiSelect}
                          theme="dark"
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PostFooter;
