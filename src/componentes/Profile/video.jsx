import {
  Box,
  Button,
  CloseButton,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { BsFillPlayFill } from "react-icons/bs"; // Icon for video selection
import { useRef, useState, useEffect } from "react";
import usePreviewVideo from "../../hooks/usePreviewVideo"; // Assuming a new hook for video preview
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore"; // Assuming this store manages video posts
import useUserProfileStore from "../../store/userProfileStore";
import { useLocation } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FaBlogger } from "react-icons/fa6";
import { MdOutlineVideoLibrary } from "react-icons/md";

const TalesLink = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [caption, setCaption] = useState("");
  const videoRef = useRef(null);
  const {
    handleVideoChange,
    selectedVideo,
    setSelectedVideo,
  } = usePreviewVideo();
  const showToast = useShowToast();
  const { isLoading, handleCreateTalesLink } = useCreateTalesLink();

  const handleTalesLinkCreation = async () => {
    try {
      await handleCreateTalesLink(selectedVideo, caption);
      onClose();
      setCaption("");
      setSelectedVideo(null);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  // Cleanup selected video on unmount
  useEffect(() => {
    return () => {
      setSelectedVideo(null);
    };
  }, [setSelectedVideo]);

  return (
    <>
      <Tooltip
        hasArrow
        label={"Create TalesLink"}
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
          <MdOutlineVideoLibrary size={"25px"} />
          <Box display={{ base: "none", md: "block" }}>Post Video</Box>
        </Flex>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />

        <ModalContent bg={"black"} border={"1px solid gray"}>
          <ModalHeader>Post Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Textarea
              placeholder="Post caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <Input
              type="file"
              accept="video/*" // Specify video file types
              hidden
              ref={videoRef}
              onChange={handleVideoChange}
            />
            <Flex>
              <BsFillPlayFill
                onClick={() => videoRef.current.click()}
                style={{
                  marginTop: "15px",
                  marginLeft: "5px",
                  cursor: "pointer",
                }}
                size={30}
              />
              <Text
                mt={"15px"}
                ml={"5px"}
                fontSize={"20px"}
                cursor={"pointer"}
                marginLeft={"10px"}
                onClick={() => videoRef.current.click()}
              >
                Select Video
              </Text>
            </Flex>
            {selectedVideo && (
              <Flex mt={5} w={"full"} position="relative">
                {/* Replace with your video preview component */}
                <video
                  src={URL.createObjectURL(selectedVideo)}
                  controls
                  width="100%"
                />

                <CloseButton
                  position={"absolute"}
                  top={2}
                  right={2}
                  onClick={() => setSelectedVideo(null)}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={handleTalesLinkCreation}
              isLoading={isLoading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TalesLink;

// useCreateTalesLink function (assuming it's in a separate file)
function useCreateTalesLink() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  // Assuming usePostStore manages video posts
  const createPost = usePostStore((state) => state.createPost);
  const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const { pathname } = useLocation();

  const handleCreateTalesLink = async (selectedVideo, caption) => {
    if (isLoading) return;
    if (!selectedVideo) throw new Error("Please select a video");
    setIsLoading(true);

    const newPost = {
      caption: caption,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      createdBy: authUser.uid,
      type: "video", // Specify post type
    };

    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      const userDocRef = doc(firestore, "users", authUser.uid);
      const videoRef = ref(storage, `talesLinks/${postDocRef.id}`); // Adjust storage path as needed

      await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
      const uploadTask = uploadBytesResumable(videoRef, selectedVideo);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Handle upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress:", progress + "%");
        },
        (error) => {
          showToast("Error", error.message, "error");
          setIsLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(videoRef);

          await updateDoc(postDocRef, { videoURL: downloadURL }); // Assuming videoURL is used for video URLs

          newPost.videoURL = downloadURL;

          if (userProfile.uid === authUser.uid) {
            createPost({ ...newPost, id: postDocRef.id });
          }

          if (pathname !== "/" && userProfile.uid === authUser.uid) {
            addPost({ ...newPost, id: postDocRef.id });
          }

          showToast("Success", "TalesLink created successfully", "success");
          setIsLoading(false);
        }
      );
    } catch (error) {
      showToast("Error", error.message, "error");
      setIsLoading(false); // Ensure loading state is reset on error
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreateTalesLink };
}
