import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Image,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

const DonationPage = () => {
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box p={5} maxW="7xl" mx="auto">
      <Stack spacing={8}>
        {/* Section 1: Information */}
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={5}
          shadow="lg"
          bg={"#023047"}
          textAlign="center"
          transition="transform 0.2s"
        >
          <Flex justifyContent="center" alignItems="center" mb={10}>
            <Heading as="h2" size="lg" color={textColor}>
              Support Us with Your Generous Donations
            </Heading>
          </Flex>
          <Image
            src="/don.jpeg"
            alt="Donation"
            mb={8}
            borderRadius="lg"
            mx="auto"
          />
          <Text fontSize="lg" color={textColor}>
            Your donations help us continue our mission of helping pets find
            loving homes. Thank you for your generosity.
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default DonationPage;
