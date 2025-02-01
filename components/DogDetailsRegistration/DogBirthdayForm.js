import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

import Button from "../UI/Button";
import DatePickerUI from "../UI/DatePickerUI";

function DogBirthdayForm({ dogName, onSubmitForm, onBack }) {
  const [dogBirthday, setDogBirthday] = useState("");

  function onSelectBirthdate(selectedDate) {
    setDogBirthday(selectedDate);
  }
  return (
    <>
      <Text style={styles.contentHeading}>When is {dogName}'s Birthday?</Text>
      <Text style={styles.regularText}>(If unknown, approximate will do)</Text>

      <View style={styles.datePickerContainer}>
        <DatePickerUI
          customStyle={styles.datePickerInput}
          onPress={onSelectBirthdate}
        />
      </View>

      {dogBirthday !== "" ? (
        <>
          <Button
            onPress={() =>
              onSubmitForm({
                dogBirthDate: dogBirthday,
                nextFormContent: "DogBreed",
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
                nextFormContent: "DogBreed",
                previousFormContent: "DogGender",
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

export default DogBirthdayForm;

const styles = StyleSheet.create({
  contentHeading: {
    fontFamily: "inter-bold",
    fontSize: 24,
    textAlign: "center",
    color: "#333333",
    lineHeight: 40,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  regularText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
  },

  datePickerContainer: {
    width: "80%",
    marginTop: 50,
    marginBottom: 50,
  },

  backButton: {
    marginVertical: 16,
  },

  backText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#007BFF",
  },

  datePickerInput: {
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    borderRadius: 6,
  },
});
