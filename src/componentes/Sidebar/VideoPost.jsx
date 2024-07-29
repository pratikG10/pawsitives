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
import { BsFillPlayFill } from "react-icons/bs";
import { useRef, useState, useEffect } from "react";
import usePreviewVideo from "../../hooks/usePreviewVideo";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
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
import { MdOutlineVideoLibrary } from "react-icons/md";

const VideoPost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [caption, setCaption] = useState("");
  const videoRef = useRef(null);
  const {
    handleVideoChange,
    selectedVideo,
    setSelectedVideo,
  } = usePreviewVideo();
  const showToast = useShowToast();
  const { isLoading, handleCreateVideoPost } = useCreateVideoPost();

  const handlePostCreation = async () => {
    try {
      await handleCreateVideoPost(selectedVideo, caption);
      onClose();
      setCaption("");
      setSelectedVideo(null);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  useEffect(() => {
    return () => {
      setSelectedVideo(null);
    };
  }, []);

  return (
    <>
      <Tooltip
        hasArrow
        label={"Create VideoPost"}
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
              accept="video/*"
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
            <Button mr={3} onClick={handlePostCreation} isLoading={isLoading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoPost;
function useCreateVideoPost() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const { pathname } = useLocation();

  const handleCreateVideoPost = async (selectedVideo, caption) => {
    if (isLoading) return;
    if (!selectedVideo) throw new Error("Please select a video");
    setIsLoading(true);

    const newPost = {
      caption: caption,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      createdBy: authUser.uid,
      type: "video",
    };

    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      const userDocRef = doc(firestore, "users", authUser.uid);
      const videoRef = ref(storage, `videos/${postDocRef.id}`);

      await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
      const uploadTask = uploadBytesResumable(videoRef, selectedVideo);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
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

          await updateDoc(postDocRef, { videoURL: downloadURL });

          newPost.videoURL = downloadURL;

          if (userProfile.uid === authUser.uid) {
            createPost({ ...newPost, id: postDocRef.id });
          }

          if (pathname !== "/" && userProfile.uid === authUser.uid) {
            addPost({ ...newPost, id: postDocRef.id });
          }

          showToast("Success", "VideoPost created successfully", "success");
          setIsLoading(false);
        }
      );
    } catch (error) {
      showToast("Error", error.message, "error");
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreateVideoPost };
}
