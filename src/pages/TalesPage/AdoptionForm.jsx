import React from "react";
import { FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";

const AdoptionForm = () => {
  return (
    <>
      <FormControl isRequired mb={3}>
        <FormLabel>First Name</FormLabel>
        <Input placeholder="First Name" />
      </FormControl>
      <FormControl isRequired mb={3}>
        <FormLabel>Last Name</FormLabel>
        <Input placeholder="Last Name" />
      </FormControl>
      <FormControl isRequired mb={3}>
        <FormLabel>City</FormLabel>
        <Input placeholder="City" />
      </FormControl>
      <FormControl isRequired mb={3}>
        <FormLabel>Pincode</FormLabel>
        <Input placeholder="Pincode" />
      </FormControl>
      <FormControl isRequired mb={3}>
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Email" />
      </FormControl>
      <FormControl isRequired mb={3}>
        <FormLabel>Mobile No</FormLabel>
        <Input type="tel" placeholder="Mobile No" />
      </FormControl>
      <FormControl isRequired mb={3}>
        <FormLabel>Address</FormLabel>
        <Textarea placeholder="Address" />
      </FormControl>
      <FormControl isRequired mb={3}>
        <FormLabel>Approx. duration of staying away from home daily</FormLabel>
        <Input placeholder="Approx. duration of staying away from home daily" />
      </FormControl>
      <FormControl isRequired mb={3}>
        <FormLabel>
          Where would you be keeping the puppy/kitten in general everyday? And
          where would you be keeping the pup when you travel on a vacation?
        </FormLabel>
        <Textarea placeholder="Your answer" />
      </FormControl>
    </>
  );
};

export default AdoptionForm;
