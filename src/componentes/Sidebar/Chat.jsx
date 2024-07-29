import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import {
  BiBookBookmark,
  BiSolidMessageRoundedDetail,
  BiSolidMessageRoundedDots,
} from "react-icons/bi";
const Chat = () => {
  return (
    <Tooltip
      hasArrow
      label={"message"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link
        display={"flex"}
        to={"/Chat"}
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <BiSolidMessageRoundedDetail size={"25px"} />
        <Box display={{ base: "none", md: "block" }}>Message</Box>
      </Link>
    </Tooltip>
  );
};

export default Chat;
