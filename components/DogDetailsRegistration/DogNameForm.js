import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";

import Button from "../UI/Button";

function DogNameForm({ onSubmitForm }) {
  const [dogName, setDogName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function onValueChange(newValue) {
    setDogName(newValue);
  }

  function checkNameValid() {
    const removedNameSpace = dogName.split(" ").join("");

    if (removedNameSpace.length < 2) {
      setErrorMessage("Name must be at least 2 characters long.");
      return false;
    }

    if (removedNameSpace.length > 30) {
      setErrorMessage("Name must not exceed 30 characters.");
      return false;
    }

    if (!/^[a-zA-Z]+$/.test(removedNameSpace)) {
      setErrorMessage("Name can only contain letters");
      return false;
    }

    if (/^\d+$/.test(removedNameSpace)) {
      setErrorMessage("Name cannot be only numbers.");
      return false;
    }

    setErrorMessage("");
    return true;
  }

  function onValidateName() {
    const nameIsValid = checkNameValid();

    if (nameIsValid) {
      onSubmitForm({
        enteredDogName: dogName,
        nextFormContent: "DogGender",
      });
    }
  }

  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.contentHeading}>
          First things first, what's your dog's name?
        </Text>
        <TextInput
          style={styles.dogNameInput}
          placeholder="Name"
          placeholderTextColor="#555555"
          onChangeText={onValueChange}
          value={dogName}
        />
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
      {dogName !== "" ? (
        <>
          <Button onPress={onValidateName} size="large">
            Next
          </Button>
          {/* <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity> */}
        </>
      ) : null}
    </>
  );
}

export default DogNameForm;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 50,
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

  dogNameInput: {
    fontFamily: "inter-regular",
    fontSize: 16,
    width: "80%",
    paddingVertical: 16,
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: "#D3D3D3",
    marginTop: 32,
    marginBottom: 40,
    alignSelf: "center",
  },

  backButton: {
    marginVertical: 16,
  },

  backText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#007BFF",
  },

  errorMessage: {
    fontFamily: "inter-regular",
    color: "#FF0000",
    textAlign: "center",
  },
});
