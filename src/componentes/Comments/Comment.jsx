import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";

const Comment = ({ comment }) => {
  const { userProfile, isLoading } = useGetUserProfileById(comment.createdBy);

  if (isLoading) return <CommentSkeleton />;
  return (
    <Flex gap={4} alignItems={"flex-start"} w={"full"} my={4}>
      <Link to={`/${userProfile.username}`}>
        <Avatar src={userProfile.profilePicURL} size={"sm"} />
      </Link>
      <Box flex="1">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap={2} alignItems={"center"}>
            <Link to={`/${userProfile.username}`}>
              <Text fontWeight={"bold"} fontSize={15}>
                {userProfile.username}
              </Text>
            </Link>
            <Text fontSize={11} color={"gray"}>
              {timeAgo(comment.createdAt)}
            </Text>
          </Flex>
        </Flex>
        <Text mt={2} fontSize={13}>
          {comment.comment}
        </Text>
      </Box>
    </Flex>
  );
};

export default Comment;

const CommentSkeleton = () => {
  return (
    <Flex gap={4} alignItems={"flex-start"} w={"full"} my={4}>
      <SkeletonCircle h={10} w="10" />
      <Box flex="1">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap={2} alignItems={"center"}>
            <Skeleton height={2} width={100} />
            <Skeleton height={2} width={50} />
          </Flex>
        </Flex>
        <Skeleton mt={2} height={2} width={"full"} />
      </Box>
    </Flex>
  );
};
