import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";

import DropdownComponent from "../UI/Dropdown";
import Button from "../UI/Button";

import { commonDogBreeds } from "../../data/symptoms";

function DogBreedForm({ dogName, onSubmitForm, onBack }) {
  const [dogBreed, setDogBreed] = useState("");
  const [inputType, setInputType] = useState(false);

  function onValueChange(newValue) {
    setDogBreed(newValue);
  }
  return (
    <>
      <View style={styles.inputsContainer}>
        <Text style={styles.contentHeading}>Pick {dogName}'s Breed</Text>

        <View style={styles.dogBreedContainer}>
          {inputType ? (
            <TextInput
              style={styles.dogBreedInput}
              placeholder="Specify breed"
              onChangeText={onValueChange}
            />
          ) : (
            <>
              <Text style={styles.inputLabelText}>Select a breed</Text>
              <DropdownComponent
                options={commonDogBreeds}
                placeholderText="Breed"
                onValueChange={onValueChange}
              />
            </>
          )}
        </View>

        {inputType ? null : (
          <TouchableOpacity
            onPress={() => {
              setInputType(true);
              setDogBreed("");
            }}
            style={styles.cantFindDogBreedButton}
          >
            <Text style={styles.cantFindDogBreedText}>
              I can't find my dog's breed.
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {dogBreed !== "" ? (
        <>
          <Button
            onPress={() =>
              onSubmitForm({
                enteredDogBreed: dogBreed,
                nextFormContent: "DogSterilization",
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
                previousFormContent: "DogBirthDay",
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

export default DogBreedForm;

const styles = StyleSheet.create({
  inputsContainer: {
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

  dogBreedContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: "80%",
  },

  inputLabelText: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },

  cantFindDogBreedButton: {
    marginTop: 16,
  },

  cantFindDogBreedText: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#666666",
    marginBottom: 24,
  },

  dogBreedInput: {
    fontFamily: "inter-regular",
    fontSize: 16,
    marginTop: 32,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    paddingVertical: 6,
    textAlign: "center",
    width: "100%",
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
