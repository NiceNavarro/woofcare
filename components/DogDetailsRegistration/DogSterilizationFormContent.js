import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

import DropdownComponent from "../UI/Dropdown";
import Button from "../UI/Button";

const sterilizationOptionsMale = [
  { label: "Neutered", value: "Neutered" },
  { label: "Not neutered", value: "Not neutered" },
  { label: "Not sure", value: "Not sure" },
];

const sterilizationOptionsFemale = [
  { label: "Spayed", value: "Spayed" },
  { label: "Not spayed", value: "Not spayed" },
  { label: "Not sure", value: "Not sure" },
];

function DogSterilizationFormContent({ dogProfile, onSubmitForm, onBack }) {
  const [dogSterilization, setDogSterilization] = useState("");

  const sterilizationOptions =
    dogProfile.dogGender === "Male"
      ? sterilizationOptionsMale
      : sterilizationOptionsFemale;

  function onValueChange(selectedValue) {
    setDogSterilization(selectedValue);
  }

  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.contentHeading}>
          Is {dogProfile.dogName}
          {dogProfile.dogGender === "Male" ? " Neutered" : " Spayed"} ?
        </Text>

        <View style={styles.sterilizationInputContainer}>
          <DropdownComponent
            options={sterilizationOptions}
            placeholderText="Select options"
            onValueChange={onValueChange}
          />
        </View>
      </View>

      {dogSterilization !== "" ? (
        <>
          <Button
            onPress={() =>
              onSubmitForm({
                selectedSterilizationOption: dogSterilization,
                nextFormContent: "DogWeight",
              })
            }
            size="large"
          >
            Next
          </Button>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              onBack({
                previousFormContent: "DogBreed",
              })
            }
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </>
  );
}

export default DogSterilizationFormContent;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 40,
    alignItems: "center",
  },
  contentHeading: {
    fontFamily: "inter-bold",
    fontSize: 24,
    textAlign: "center",
    color: "#333333",
    lineHeight: 40,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  sterilizationInputContainer: {
    width: "80%",
    marginTop: 8,
    marginBottom: 28,
  },

  backButton: {
    marginVertical: 16,
  },

  backText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#007BFF",
  },
});
