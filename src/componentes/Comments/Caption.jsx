import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";
import useUserProfileStore from "../../store/userProfileStore";

const renderCaptionWithMentions = (caption) => {
  const parts = caption.split(/(@\w+)/g); // Split text by mentions

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const username = part.slice(1);
      return (
        <ChakraLink key={index} as={Link} to={`/${username}`} color="blue.500">
          {part}
        </ChakraLink>
      );
    }
    return part;
  });
};

const Caption = ({ post }) => {
  const { userProfile, isLoading } = useUserProfileStore((state) => ({
    userProfile: state.userProfile,
    isLoading: state.isLoading,
  }));
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

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if (!userProfile) {
    return (
      <Flex gap={2} alignItems={"center"}>
        <Avatar size={"sm"} />
        <Flex direction="column">
          <Text fontWeight={"bold"} fontSize={12}>
            Unknown User
          </Text>
          <Text fontSize={12} color={"gray"}>
            {timeAgo(post.createdAt)}
          </Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <>
      <Flex gap={2} alignItems={"center"}>
        <Link to={`/${userProfile.username}`}>
          <Avatar src={userProfile.profilePicURL} size={"sm"} />
        </Link>
        <Flex direction="column">
          <Link to={`/${userProfile.username}`}>
            <Text fontWeight={"bold"} fontSize={12}>
              {userProfile.username}
            </Text>
          </Link>
          <Text fontSize={12} color={"gray"}>
            {timeAgo(post.createdAt)}
          </Text>
        </Flex>
      </Flex>
      <Box mt={2} ml={9}>
        <Text
          fontSize="sm"
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

export default Caption;
