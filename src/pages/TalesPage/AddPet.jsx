import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Heading,
} from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firestore, storage } from "../../firebase/firebase";

const AddPet = () => {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [shelterName, setShelterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const petData = {
      category,
      name,
      breed,
      age,
      sex,
      size,
      description,
      city,
      state,
      shelterName,
    };

    if (image) {
      const storageRef = ref(storage, `pets/${category}/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Image upload failed:", error);
          setIsLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          petData.imageUrl = downloadURL;
          await addDoc(collection(firestore, "pets"), petData);
          setIsLoading(false);
        }
      );
    } else {
      await addDoc(collection(firestore, "pets"), petData);
      setIsLoading(false);
    }
  };

  return (
    <Box p={5} maxW="600px" mx="auto">
      <Heading mb={6}>Add New Pet</Heading>
      <FormControl mb={3}>
        <FormLabel>Category</FormLabel>
        <Select
          placeholder="Select category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="other">Other</option>
        </Select>
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Breed</FormLabel>
        <Input value={breed} onChange={(e) => setBreed(e.target.value)} />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Age</FormLabel>
        <Input value={age} onChange={(e) => setAge(e.target.value)} />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Sex</FormLabel>
        <Select value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Size</FormLabel>
        <Select
          placeholder="Select size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="giant">Giant</option>
        </Select>
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>City</FormLabel>
        <Input value={city} onChange={(e) => setCity(e.target.value)} />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>State</FormLabel>
        <Input value={state} onChange={(e) => setState(e.target.value)} />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Shelter Name</FormLabel>
        <Input
          value={shelterName}
          onChange={(e) => setShelterName(e.target.value)}
        />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Image</FormLabel>
        <Input type="file" onChange={handleImageChange} />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
        Add Pet
      </Button>
    </Box>
  );
};

export default AddPet;
