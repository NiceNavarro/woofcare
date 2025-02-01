import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

import Button from "../UI/Button";

function DogGenderForm({ dogName, onSubmitForm, onBack }) {
  const [dogGender, setDogGender] = useState("");

  function onSelectGender(selectedGender) {
    setDogGender(selectedGender);
  }

  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.contentHeading}>Choose {dogName}'s gender</Text>

        <View style={styles.genderOptionsContainer}>
          <TouchableOpacity
            onPress={() => onSelectGender("Male")}
            style={[
              styles.genderButton,
              dogGender === "Male" && styles.genderButtonActiveMale,
            ]}
          >
            <Image
              style={styles.genderImage}
              source={
                dogGender === "Male"
                  ? require("../../assets/MaleActive.png")
                  : require("../../assets/Male.png")
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSelectGender("Female")}
            style={[
              styles.genderButton,
              dogGender === "Female" && styles.genderButtonActiveFemale,
            ]}
          >
            <Image
              style={styles.genderImage}
              source={
                dogGender === "Female"
                  ? require("../../assets/FemaleActive.png")
                  : require("../../assets/Female.png")
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.genderTextContainer}>
          <View style={styles.genderTextWrapper}>
            <Text
              style={[
                styles.genderText,
                dogGender === "Male" && styles.genderTextActiveMale,
              ]}
            >
              Male
            </Text>
          </View>
          <View style={styles.genderTextWrapper}>
            <Text
              style={[
                styles.genderText,
                dogGender === "Female" && styles.genderTextActiveFemale,
              ]}
            >
              Female
            </Text>
          </View>
        </View>
      </View>
      {dogGender !== "" ? (
        <>
          <Button
            onPress={() =>
              onSubmitForm({
                selectedDogGender: dogGender,
                nextFormContent: "DogBirthDay",
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
                nextFormContent: "DogBirthday",
                previousFormContent: "DogName",
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

export default DogGenderForm;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 50,
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

  genderOptionsContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 32,
    marginBottom: 16,
  },

  genderButton: {
    width: 150,
    height: 150,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  genderButtonActiveMale: {
    backgroundColor: "#62AEDE",
  },

  genderButtonActiveFemale: {
    backgroundColor: "#F36794",
  },

  genderTextActiveMale: {
    fontFamily: "inter-semi-bold",
    color: "#62AEDE",
  },

  genderTextActiveFemale: {
    fontFamily: "inter-semi-bold",
    color: "#F36794",
  },

  genderTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "red",
    marginBottom: 32,
  },

  genderTextWrapper: {
    width: 150,
    alignItems: "center",
  },

  genderText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
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
