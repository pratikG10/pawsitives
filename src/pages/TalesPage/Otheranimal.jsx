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
} from "@chakra-ui/react";
import { firestore } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import AdoptionForm from "./AdoptionForm";

const Otheranimal = () => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdoptionFormVisible, setIsAdoptionFormVisible] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnimals = async () => {
      const petCollection = collection(firestore, "pets");
      const animalQuery = query(
        petCollection,
        where("category", "==", "other")
      );
      const animalSnapshot = await getDocs(animalQuery);
      const animalList = animalSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnimals(animalList);
    };

    fetchAnimals();
  }, []);

  const openModal = (animal) => {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
    setIsAdoptionFormVisible(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnimal(null);
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
      <Heading as="h1" mb={6} textAlign="center" color="black">
        Other Animals for Adoption
      </Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={9}>
        {animals.map((animal) => (
          <Box
            key={animal.id}
            p={5}
            boxShadow="md"
            borderRadius="md"
            bg="linear-gradient(135deg, #aed1ef, #f8dadc,#f2bbf1)"
            overflow="hidden"
            cursor="pointer"
            onClick={() => openModal(animal)}
            _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
          >
            <Image
              src={animal.imageUrl}
              alt={animal.name}
              boxSize="250px"
              objectFit="cover"
              borderRadius="md"
              mb={3}
              mx="auto"
            />
            <Box textAlign="center">
              <Heading as="h2" size="md" mb={2} color="black">
                {animal.name}
              </Heading>
              <Text fontSize="sm" color="gray.700">
                {animal.breed} . {animal.city}
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="2xl">
        <ModalOverlay />
        <ModalContent
          bg="linear-gradient(135deg, #aed1ef, #f8dadc,#f2bbf1)"
          color="black"
        >
          <ModalHeader textAlign="center" fontWeight="800" fontSize="2xl">
            {selectedAnimal ? selectedAnimal.name : "Animal Details"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isAdoptionFormVisible && selectedAnimal && (
              <Box textAlign="center">
                <Image
                  src={selectedAnimal.imageUrl}
                  alt={selectedAnimal.name}
                  boxSize="300px"
                  objectFit="cover"
                  borderRadius="md"
                  mb={4}
                  mx="auto"
                />
                <Flex justifyContent="center">
                  <Grid
                    templateColumns="repeat(2, 1fr)"
                    gap={6}
                    textAlign="center"
                    w="80%"
                  >
                    <Box>
                      <Text fontWeight="bold">
                        Breed: {selectedAnimal.breed}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Age: {selectedAnimal.age}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Sex: {selectedAnimal.sex}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Size: {selectedAnimal.size}</Text>
                    </Box>
                    {selectedAnimal.city && (
                      <Box>
                        <Text fontWeight="bold">
                          City: {selectedAnimal.city}
                        </Text>
                      </Box>
                    )}
                    {selectedAnimal.state && (
                      <Box>
                        <Text fontWeight="bold">
                          State: {selectedAnimal.state}
                        </Text>
                      </Box>
                    )}
                  </Grid>
                </Flex>
                {selectedAnimal.shelterName && (
                  <Box alignItems={"center"}>
                    <Text mt={5} fontWeight="bold">
                      Shelter Name: {selectedAnimal.shelterName}
                    </Text>
                  </Box>
                )}
                <Box textAlign="left" mt={4}>
                  <Text fontWeight="bold" mb={2}>
                    About Me:
                  </Text>
                  <Text fontSize={18} fontWeight={450} mb={4}>
                    {selectedAnimal.description}
                  </Text>
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
        <ModalContent bg="teal.500" color="white">
          <ModalHeader textAlign="center">Thank You!</ModalHeader>
          <ModalBody textAlign="center">
            Your response has been submitted. We will respond to you soon.
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="blue" onClick={closeConfirmationModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Otheranimal;
