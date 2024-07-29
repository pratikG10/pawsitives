import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUser from "../../hooks/useFollowUser";
import { timeAgo } from "../../utils/timeAgo";

const PostHeader = ({ post, creatorProfile }) => {
  const { handleFollowUser, isFollowing, isUpdating } = useFollowUser(
    post.createdBy
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(textRef.current).lineHeight,
        10
      );
      const maxLines = 4;
      const maxHeight = lineHeight * maxLines;
      if (textRef.current.scrollHeight > maxHeight) {
        setNeedsReadMore(true);
      }
    }
  }, [post.caption]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const renderCaptionWithMentions = (caption) => {
    const parts = caption.split(/(@\w+)/g); // Split text by mentions

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.slice(1);
        return (
          <ChakraLink
            key={index}
            as={Link}
            to={`/${username}`}
            color="blue.500"
          >
            {part}
          </ChakraLink>
        );
      }
      return part;
    });
  };

  return (
    <>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        w={"full"}
        my={2}
      >
        <Flex alignItems={"center"} gap={3}>
          {creatorProfile ? (
            <Link to={`/${creatorProfile.username}`}>
              <Avatar
                src={creatorProfile.profilePicURL}
                alt="user profile pic"
                size={"sm"}
              />
            </Link>
          ) : (
            <SkeletonCircle size="10" />
          )}

          <Flex fontSize={14} fontWeight={"bold"} gap="3">
            {creatorProfile ? (
              <Link to={`/${creatorProfile.username}`}>
                {creatorProfile.username}
              </Link>
            ) : (
              <Skeleton w={"100px"} h={"10px"} />
            )}
            <Box color={"gray.700"}>• {timeAgo(post.createdAt)}</Box>
          </Flex>
        </Flex>
        <Box cursor={"pointer"}>
          <Button
            size={"xs"}
            bg={"transparent"}
            fontSize={14}
            color={"blue.500"}
            fontWeight={"bold"}
            _hover={{ color: "white" }}
            transition={"0.2s ease-in-out"}
            onClick={handleFollowUser}
            isLoading={isUpdating}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </Box>
      </Flex>
      <Box>
        <Text
          fontSize="15"
          fontWeight={500}
          noOfLines={isExpanded ? undefined : 4}
          ref={textRef}
          whiteSpace="pre-wrap"
          letterSpacing={1.1}
        >
          {renderCaptionWithMentions(post.caption)}
        </Text>
        {needsReadMore && (
          <Button
            size="xs"
            onClick={toggleReadMore}
            variant="link"
            color="blue.500"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </Button>
        )}
      </Box>
    </>
  );
};

export default PostHeader;
