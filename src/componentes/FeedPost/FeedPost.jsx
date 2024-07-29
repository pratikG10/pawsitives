import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box, Image, Spinner, Text, IconButton } from "@chakra-ui/react";
import { FaVolumeMute, FaVolumeUp, FaPlay } from "react-icons/fa";
import PropTypes from "prop-types";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";

const FeedPost = ({ post }) => {
  const { userProfile, isLoading, error } = useGetUserProfileById(
    post.createdBy
  );
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1 / 1");

  const handleSingleTap = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDoubleTap = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [handleIntersection]);

  useEffect(() => {
    const determineAspectRatio = (url) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          const aspectRatio = width / height;

          if (aspectRatio === 1) {
            resolve("1 / 1"); // Square
          } else if (aspectRatio > 1) {
            resolve("1.91 / 1"); // Landscape
          } else {
            resolve("4 / 5"); // Portrait
          }
        };
      });
    };

    if (post.imageURL) {
      determineAspectRatio(post.imageURL).then((ratio) => {
        setAspectRatio(ratio);
      });
    } else if (post.videoURL) {
      setAspectRatio("16 / 9");
    }
  }, [post.imageURL, post.videoURL]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>Error loading user profile</Text>;
  }

  return (
    <>
      <PostHeader post={post} creatorProfile={userProfile} />
      <Box my={2} position="relative" borderRadius={4} overflow="hidden">
        {post.videoURL ? (
          <Box
            onClick={handleSingleTap}
            onDoubleClick={handleDoubleTap}
            position="relative"
            sx={{ aspectRatio }}
          >
            <video
              ref={videoRef}
              src={post.videoURL}
              alt={`Video by ${userProfile?.username}`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              muted={isMuted}
              autoPlay
            />
            <IconButton
              onClick={handleMuteToggle}
              icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              position="absolute"
              bottom="10px"
              right="10px"
              zIndex="10"
              aria-label={isMuted ? "Unmute" : "Mute"}
            />
            {!isPlaying && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                zIndex="10"
                pointerEvents="none"
              >
                <FaPlay size="48px" color="white" />
              </Box>
            )}
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ aspectRatio }}
          >
            <Image
              src={post.imageURL}
              alt={`Image by ${userProfile?.username}`}
              maxHeight="100%"
              maxWidth="100%"
              objectFit="contain"
              objectPosition="center"
            />
          </Box>
        )}
      </Box>
      <PostFooter post={post} creatorProfile={userProfile} />
    </>
  );
};

FeedPost.propTypes = {
  post: PropTypes.shape({
    createdBy: PropTypes.string.isRequired,
    videoURL: PropTypes.string,
    imageURL: PropTypes.string,
  }).isRequired,
};

export default FeedPost;
