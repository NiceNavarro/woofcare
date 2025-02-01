import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

import { useState, useContext } from "react";

import DropdownComponent from "../UI/Dropdown";
import DatePickerUI from "../UI/DatePickerUI";
import { commonDogVaccines } from "../../data/symptoms";

import { date } from "zod";
import { AuthContext } from "../../store/auth-context";
import { saveVaccination } from "../../util/databasePost";

import LoadSpinner from "../Modal/LoadSpinner";
import SuccessAnimation from "../Modal/SuccessAnimation";

function VaccinationForm({ visible, onClose }) {
  const [vaccine, setVaccine] = useState("");
  const [dateAdministered, setDateAdministered] = useState("");
  const [nextBoosterDate, setNextBoosterDate] = useState("");
  const [veterinarian, setVeterinarian] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);

  const [isSavingData, setIsSavingData] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const authContext = useContext(AuthContext);

  function onVaccineValueChange(newValue) {
    setVaccine(newValue);
  }

  function onSelectDateAdministered(selectedDate) {
    setDateAdministered(selectedDate);
  }

  function onSelectDateNextBooster(selectedDate) {
    setNextBoosterDate(selectedDate);
  }

  function onVeterinarianInputChange(newValue) {
    setVeterinarian(newValue);
  }

  function onNoteInputChange(newValue) {
    setAdditionalNotes(newValue);
  }

  function handleOnCloseFormModal() {
    setVaccine("");
    setDateAdministered("");
    setNextBoosterDate("");
    setVeterinarian("");
    setAdditionalNotes("");
    setErrorMessageVisible(false);
    setIsSavingData(false);
    setSuccessModalVisible(false);
    onClose();
  }

  function onCloseSuccessModal() {
    setSuccessModalVisible(false);
    handleOnCloseFormModal();
  }

  async function onSubmitForm() {
    if (vaccine === "" || dateAdministered === "" || nextBoosterDate === "") {
      setErrorMessageVisible(true);
      return;
    }

    const vaccinationFormData = {
      vaccine: vaccine,
      dateAdministered: dateAdministered,
      nextBoosterDate: nextBoosterDate,
      veterinarian: veterinarian === "" ? "N/A" : veterinarian,
      additionalNotes: additionalNotes === "" ? "N/A" : additionalNotes,
      dogId: authContext.currentDogId,
      userId: authContext.currentUserId,
    };

    setIsSavingData(true);
    try {
      const vaccineId = await saveVaccination(vaccinationFormData);
      console.log("Vaccination data saved successfully! ID: ", vaccineId);
      authContext.setVaccines([
        {
          vaccineId: vaccineId,
          ...vaccinationFormData,
        },
      ]);
    } catch (error) {
      console.log("Error saving vaccine data: ", error);
    }
    setIsSavingData(false);
    setSuccessModalVisible(true);
  }

  console.log(authContext.vaccines);

  if (isSavingData) {
    return (
      <LoadSpinner
        visible={isSavingData}
        prompt={"Saving your vaccination data... Please wait."}
      />
    );
  }

  return (
    <>
      <Modal
        animationType="slide"
        visible={visible}
        onRequestClose={handleOnCloseFormModal}
      >
        <View style={styles.content}>
          <TouchableOpacity
            onPress={handleOnCloseFormModal}
            style={styles.backButtonContainer}
          >
            <Image
              style={styles.leftArrowIcon}
              source={require("../../assets/arrow-left.png")}
            />
            <Text style={styles.goBackText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Log Your Dog's Vaccination</Text>
          <Text style={styles.subHeading}>
            Keep your dog's vaccination records in one place. Logging vaccines
            helps you stay on top of your pet's health and ensures you're always
            prepared for their next visit to the vet.
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.vaccineInputContainer}>
              <Text style={styles.inputLabel}>Select Vaccine (required) </Text>
              <DropdownComponent
                options={commonDogVaccines}
                onValueChange={onVaccineValueChange}
              />
            </View>
            <View style={styles.administeredInputContainer}>
              <DatePickerUI
                onPress={onSelectDateAdministered}
                customStyle={styles.datePickerInput}
                textLabel="Administered (required)"
              />
            </View>

            <View style={styles.nextBoosterInputContainer}>
              <DatePickerUI
                onPress={onSelectDateNextBooster}
                customStyle={styles.datePickerInput}
                textLabel="Next Booster (required)"
              />
            </View>

            <View style={styles.textInputContainer}>
              <Text style={styles.inputLabel}>Veterinarian (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Dr Smith (Happy Tails Vet Clinic)"
                onChangeText={onVeterinarianInputChange}
                value={veterinarian}
              />
            </View>

            <View style={styles.textInputContainer}>
              <Text style={styles.inputLabel}>Additional Notes (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Mild swelling after injection."
                onChangeText={onNoteInputChange}
                value={additionalNotes}
              />
            </View>
            {errorMessageVisible && (
              <Text style={styles.fieldErrorMessage}>
                Please ensure all required fields are filled out correctly or
                selected before proceeding.
              </Text>
            )}
          </ScrollView>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleOnCloseFormModal}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSubmitForm} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <SuccessAnimation
        visible={successModalVisible}
        onClose={onCloseSuccessModal}
        successMessage="Vaccine added successfully!"
      />
    </>
  );
}

export default VaccinationForm;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  leftArrowIcon: {
    width: 25,
    height: 25,
  },
  goBackText: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    marginLeft: 16,
    color: "#333333",
  },

  heading: {
    fontFamily: "inter-bold",
    fontSize: 22,
    color: "#333333",
    marginTop: 30,
    marginBottom: 16,
  },

  subHeading: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginBottom: 16,
  },

  vaccineInputContainer: {
    marginVertical: 24,
  },

  inputLabel: {
    fontFamily: "inter-regular",
    color: "#666666",
    marginBottom: 8,
  },

  datePickerInput: {
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
  },

  textInputContainer: {
    marginBottom: 30,
  },

  textInput: {
    fontFamily: "inter-regular",
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 16,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },

  cancelButton: {
    backgroundColor: "#F5F5F5",
    width: "40%",
    paddingVertical: 16,
    borderRadius: 6,
  },

  submitButton: {
    backgroundColor: "#007BFF",
    width: "40%",
    paddingVertical: 16,
    borderRadius: 6,
    marginLeft: 16,
  },

  cancelButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },

  submitButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },

  fieldErrorMessage: {
    fontFamily: "inter-regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#D32F2F",
    marginBottom: 24,
  },
});
