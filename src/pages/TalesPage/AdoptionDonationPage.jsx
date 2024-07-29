import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Image,
  SimpleGrid,
  Flex,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const AdoptionDonationPage = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const cardHoverBg = useColorModeValue("gray.200", "gray.600");
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
          bg="linear-gradient(135deg, #d66fee, #efb7ea,#d66fee)"
          textAlign="center"
          transition="transform 0.2s"
        >
          <Flex justifyContent="center" alignItems="center" mb={10}>
            <Heading as="h2" size="lg" color={"black"}>
              Discover the Joy of Unconditional Love—Welcome to Our Pet Adoption
              Page!
            </Heading>
          </Flex>
          <Image
            src="/2.jpg"
            alt="Adoption"
            mb={8}
            borderRadius="lg"
            mx="auto"
          />
          <Text fontSize="25" color={"black"} fontWeight={600}>
            "Saving one pet won't change the world, but for that one pet, the
            world will change forever."
          </Text>
        </Box>

        {/* Section 2: Categories */}
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={5}
          shadow="lg"
          bg="linear-gradient(135deg, #d66fee, #efb7ea,#d66fee)"
          textAlign="center"
          transition="transform 0.2s"
        >
          <Heading as="h2" size="lg" mb={4} color={"black"} fontWeight={"bold"}>
            Find your new best friend
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
            {[
              { name: "Dogs", path: "/dogs", image: "/dogicon.jpg" },
              { name: "Cats", path: "/cats", image: "/caticon.jpg" },
              {
                name: "Other Animals",
                path: "/other-animals",
                image: "/paaa.webp",
              },
              {
                name: "Donation",
                path: "/donation",
                image: "/shel.png",
              },
            ].map((category) => (
              <Box
                as={Link}
                to={category.path}
                textAlign="center"
                p={5}
                borderWidth="1px"
                borderRadius="lg"
                shadow="lg"
                bg="linear-gradient(135deg, #aed1ef, #f8dadc,#f2bbf1)"
                _hover={{
                  bg: "linear-gradient(135deg, #aed1ef, #f8dadc,#f2bbf1)",
                  transform: "scale(1.05)",
                }}
                key={category.name}
                transition="transform 0.2s"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  mb={2}
                  borderRadius="full"
                  boxSize="100px"
                  mx="auto"
                />
                <Text fontWeight="bold" fontSize="lg" color={"black"}>
                  {category.name}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Stack>
    </Box>
  );
};

export default AdoptionDonationPage;
