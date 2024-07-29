import { Box, Flex, Text } from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3, BsSuitHeart } from "react-icons/bs";
import { Link } from "react-router-dom";

const ProfileTabs = () => {
  return (
    <Flex
      w={"full"}
      justifyContent={"center"}
      gap={{ base: 4, sm: 10 }}
      textTransform={"uppercase"}
      fontWeight={"bold"}
    >
      <Flex
        borderTop={"1px solid white"}
        alignItems={"center"}
        p="3"
        gap={1}
        cursor={"pointer"}
      >
        <Box fontSize={20}>
          <BsGrid3X3 />
        </Box>
        <Text fontSize={12} display={{ base: "none", sm: "block" }}>
          Posts
        </Text>
      </Flex>

      <Link to="/saved" style={{ textDecoration: "none" }}>
        <Flex alignItems={"center"} p="3" gap={1} cursor={"pointer"}>
          <Box fontSize={20}>
            <BsBookmark />
          </Box>
          <Text fontSize={12} display={{ base: "none", sm: "block" }}>
            Saved
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
};

export default ProfileTabs;
