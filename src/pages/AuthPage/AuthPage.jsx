import { Box, Container, Flex, Image, VStack } from "@chakra-ui/react";
import AuthForm from "../../componentes/AuthForm/AuthForm";

const AuthPage = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
      <Container maxW={"container.md"}>
        <Flex justifyContent={"center"} alignItems={"center"} gap={10}>
          <Box display={{ base: "none", md: "block" }}>
            <Image src="/auth.jpg" h={650} alt="pets" />
          </Box>
          <VStack spacing={4} align={"stretch"}>
            <AuthForm />
            <Box textAlign={"center"}> Get the app.</Box>
            <Flex gap={5} justifyContent={"center"}>
              <Image src="playstore.png" h={10} />
              <Image src="microsoft.png" h={10} />
            </Flex>
          </VStack>
        </Flex>
      </Container>
    </Flex>
  );
};

export default AuthPage;
