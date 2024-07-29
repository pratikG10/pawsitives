import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { BiBookBookmark } from "react-icons/bi";

const Furryt = () => {
  return (
    <Tooltip
      hasArrow
      label={"Adopt me"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link
        display={"flex"}
        to={"/tales"}
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <BiBookBookmark size={"25px"} />
        <Box display={{ base: "none", md: "block" }}>Adopt Me</Box>
      </Link>
    </Tooltip>
  );
};

export default Furryt;
