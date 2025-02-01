import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";

import Button from "../UI/Button";

function DogWeightForm({ dogName, onSubmitForm, onBack }) {
  const [dogWeight, setDogWeight] = useState(null);

  function onValueChange(newValue) {
    setDogWeight(newValue);
  }

  return (
    <>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeading}>
          And finally, what's {dogName}'s weight?
        </Text>

        <View style={styles.weightInputFormContainer}>
          <Text style={styles.weightFormLabel}>Weight</Text>
          <View style={styles.weightInputForm}>
            <Image
              style={styles.weightScaleImage}
              source={require("../../assets/weightScale.png")}
            />
            <TextInput
              style={styles.weightInput}
              keyboardType="numeric"
              onChangeText={onValueChange}
            />
            <Text style={styles.weightLabelText}>KG</Text>
          </View>
        </View>
      </View>
      {dogWeight !== "" ? (
        <>
          <Button
            onPress={() =>
              onSubmitForm({
                enteredDogWeight: dogWeight,
                nextFormContent: "SetupComplete",
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
                previousFormContent: "DogSterilization",
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

export default DogWeightForm;

const styles = StyleSheet.create({
  contentContainer: {
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

  weightInputFormContainer: {
    marginTop: 24,
    alignSelf: "center",
    width: "80%",
  },

  weightFormLabel: {
    fontSize: "inter-regular",
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },

  weightInputForm: {
    fontFamily: "inter-regular",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 8,
  },

  weightScaleImage: {
    width: 25,
    height: 25,
  },

  weightInput: {
    flex: 2,
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    paddingHorizontal: 10,
  },

  weightLabelText: {
    fontFamily: "inter-medium",
    color: "#666666",
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
