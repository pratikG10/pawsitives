import React, { useState } from "react";
import {
  Container,
  Flex,
  Grid,
  Spinner,
  Text,
  Box,
  Image,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5"; // Import the IoArrowBack icon
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import PropTypes from "prop-types";
import useFetchSavedPosts from "../../hooks/useFetchSavedPosts";
import FeedPost from "../FeedPost/FeedPost";

const SavedPosts = () => {
  const { savedPosts, isLoading, error } = useFetchSavedPosts();
  const [selectedPost, setSelectedPost] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handlePostClick = (post) => {
    setSelectedPost(post);
    onOpen();
  };

  if (isLoading) {
    return (
      <Container maxW={"container.lg"} py={5}>
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW={"container.lg"} py={5}>
        <Flex justify="center" align="center" height="100vh">
          <Text color="red.500">
            Error fetching saved posts: {error.message}
          </Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW={"container.lg"} py={5}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "2xl", md: "2xl" }}
      >
        <ModalOverlay />
        <ModalCloseButton color="whiteAlpha.800" size="lg" mt={2} mr={2} />

        <ModalContent bg="#000000" border={"1px solid #301934"}>
          <Flex justify="space-between" align="center" p={2}>
            {/* Add any additional buttons or elements here */}
          </Flex>
          <ModalBody>
            {selectedPost && <FeedPost post={selectedPost} />}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex
        py={10}
        px={4}
        pl={{ base: 4, md: 10 }}
        w={"full"}
        mx={"auto"}
        flexDirection={"row"}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Button onClick={() => navigate(-1)} mr={4}>
          <IoArrowBack fontSize={20} />
          {/* Use the IoArrowBack icon inside the button */}
        </Button>
        <Text fontSize="2xl" fontWeight="bold" textAlign="left">
          Saved Posts
        </Text>
      </Flex>
      <Flex>
        <Text fontSize="18" fontWeight="bold" textAlign="left" mb={5}>
          All Posts
        </Text>
      </Flex>
      <Grid
        templateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap={1}
        columnGap={1}
      >
        {isLoading &&
          [0, 1, 2].map((_, idx) => (
            <Flex key={idx} alignItems={"flex-start"} gap={4}>
              <Spinner w={"full"}>
                <Box h="300px">contents wrapped</Box>
              </Spinner>
            </Flex>
          ))}

        {!isLoading &&
          savedPosts.map((post) => (
            <ProfilePostItem
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post)}
            />
          ))}
      </Grid>
    </Container>
  );
};

const ProfilePostItem = ({ post, onClick }) => {
  return (
    <GridItem
      cursor={"pointer"}
      borderRadius={4}
      overflow={"hidden"}
      border={"1px solid"}
      borderColor={"whiteAlpha.300"}
      position={"relative"}
      aspectRatio={1 / 1}
      onClick={onClick}
      _hover={{
        ".overlay": {
          opacity: 1,
        },
      }}
    >
      {post.videoURL ? (
        <video
          controls
          src={post.videoURL}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Image
          src={post.imageURL}
          alt="profile post"
          w={"100%"}
          h={"100%"}
          objectFit={"cover"}
        />
      )}

      <Flex
        opacity={0}
        _hover={{ opacity: 1 }}
        position={"absolute"}
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={"blackAlpha.700"}
        transition={"all 0.3s ease"}
        zIndex={1}
        justifyContent={"center"}
        className="overlay"
      >
        <Flex alignItems={"center"} justifyContent={"center"} gap={50}>
          <Flex>
            <AiFillHeart size={20} />
            <Text fontWeight={"bold"} ml={2} color={"white"}>
              {post.likes.length}
            </Text>
          </Flex>

          <Flex>
            <FaComment size={20} />
            <Text fontWeight={"bold"} ml={2} color={"white"}>
              {post.comments.length}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </GridItem>
  );
};

ProfilePostItem.propTypes = {
  post: PropTypes.shape({
    videoURL: PropTypes.string,
    imageURL: PropTypes.string,
    likes: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SavedPosts;
