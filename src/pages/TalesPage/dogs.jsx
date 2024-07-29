import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Image,
  Text,
  Button,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
} from "@chakra-ui/react";
import { firestore } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import AdoptionForm from "./AdoptionForm";

const Dogs = () => {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdoptionFormVisible, setIsAdoptionFormVisible] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  useEffect(() => {
    const fetchDogs = async () => {
      const petCollection = collection(firestore, "pets");
      const dogQuery = query(petCollection, where("category", "==", "dog"));
      const dogSnapshot = await getDocs(dogQuery);
      const dogList = dogSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDogs(dogList);
    };

    fetchDogs();
  }, []);

  const openModal = (dog) => {
    setSelectedDog(dog);
    setIsModalOpen(true);
    setIsAdoptionFormVisible(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDog(null);
  };

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const showAdoptionForm = () => {
    setIsAdoptionFormVisible(true);
  };

  return (
    <Box p={5} maxW="1000px" mx="auto">
      <Heading
        as="h1"
        mb={6}
        textAlign="center"
        color="black"
        h={"7vh"}
        bg="linear-gradient(135deg, #aed1ef, #f8dadc,#f2bbf1)"
      >
        Dogs for Adoption....
      </Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={9}>
        {dogs.map((dog) => (
          <Box
            key={dog.id}
            p={5}
            boxShadow="md"
            borderRadius="md"
            bg="linear-gradient(135deg, #aed1ef, #f8dadc,#f2bbf1)"
            overflow="hidden"
            cursor="pointer"
            onClick={() => openModal(dog)}
            _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
          >
            <Image
              src={dog.imageUrl}
              alt={dog.name}
              boxSize="250px"
              objectFit="cover"
              borderRadius="md"
              mb={3}
              mx="auto"
            />
            <Divider borderColor="gray.500" my={4} />

            <Box textAlign="center">
              <Heading as="h2" size="md" mb={2} color="black">
                {dog.name}
              </Heading>

              <Text fontSize="sm" color="gray.700">
                {dog.breed} . {dog.city}
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="2xl">
        <ModalOverlay />
        <ModalContent
          bg={
            !isAdoptionFormVisible
              ? "linear-gradient(135deg, #aed1ef, #f2dfc1,#f0b9ef)"
              : "#301934"
          }
          color={!isAdoptionFormVisible ? "black" : "white"}
        >
          <ModalHeader textAlign="center" fontWeight="800" fontSize="2xl">
            {selectedDog ? selectedDog.name : "Dog Details"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isAdoptionFormVisible && selectedDog && (
              <Box textAlign="center">
                <Image
                  src={selectedDog.imageUrl}
                  alt={selectedDog.name}
                  boxSize="300px"
                  objectFit="cover"
                  borderRadius="md"
                  mb={4}
                  mx="auto"
                  border="1px solid black"
                />
                <Divider borderColor="gray.400" my={4} />

                <Flex justifyContent="center">
                  <Grid
                    templateColumns="repeat(2, 1fr)"
                    gap={6}
                    textAlign="center"
                    w="80%"
                  >
                    <Box>
                      <Text fontWeight="bold">Breed: {selectedDog.breed}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Age: {selectedDog.age}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Sex: {selectedDog.sex}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Size: {selectedDog.size}</Text>
                    </Box>
                    {selectedDog.city && (
                      <Box>
                        <Text fontWeight="bold">City: {selectedDog.city}</Text>
                      </Box>
                    )}
                    {selectedDog.state && (
                      <Box>
                        <Text fontWeight="bold">
                          State: {selectedDog.state}
                        </Text>
                      </Box>
                    )}
                  </Grid>
                </Flex>
                {selectedDog.shelterName && (
                  <Box alignItems={"center"}>
                    <Text mt={5} fontWeight="bold">
                      Shelter Name: {selectedDog.shelterName}
                    </Text>
                  </Box>
                )}
                <Divider borderColor="gray.400" my={4} />

                <Box textAlign="left" mt={4}>
                  <Text fontWeight="bold" mb={2}>
                    About Me:
                  </Text>
                  <Text fontSize={18} fontWeight={450} mb={4}>
                    {selectedDog.description}
                  </Text>
                  <Divider borderColor="gray.400" my={4} />
                </Box>
              </Box>
            )}
            {isAdoptionFormVisible && <AdoptionForm />}
          </ModalBody>

          <ModalFooter justifyContent="center">
            {!isAdoptionFormVisible ? (
              <Button colorScheme="blue" onClick={showAdoptionForm} mx="auto">
                Adopt Me
              </Button>
            ) : (
              <Flex width="100%" justifyContent="center">
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    closeModal();
                    openConfirmationModal();
                  }}
                >
                  Submit
                </Button>
                <Button variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
              </Flex>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isConfirmationModalOpen} onClose={closeConfirmationModal}>
        <ModalOverlay />
        <ModalContent bg="orange.300" color="white">
          <ModalHeader textAlign="center">Thank You!</ModalHeader>
          <ModalBody textAlign="center">
            Your response has been submitted. We will respond to you soon.
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="black" onClick={closeConfirmationModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dogs;
