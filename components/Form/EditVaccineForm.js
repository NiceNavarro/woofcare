import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import DropdownComponent from "../UI/Dropdown";
import DatePickerUI from "../UI/DatePickerUI";
import { AuthContext } from "../../store/auth-context";
import { useState, useContext } from "react";

import { commonDogVaccines } from "../../data/symptoms";
import { editVaccine } from "../../util/databasePatch";

import LoadSpinner from "../Modal/LoadSpinner";
import SuccessAnimation from "../Modal/SuccessAnimation";

function EditVaccineForm({ visible, onClose, vaccineRecord }) {
  const authContext = useContext(AuthContext);

  const [vaccine, setVaccine] = useState(vaccineRecord?.vaccine || "");
  const [dateAdministered, setDateAdministered] = useState(
    vaccineRecord?.dateAdministered || ""
  );
  const [nextBoosterDate, setNextBoosterDate] = useState(
    vaccineRecord?.nextBoosterDate || ""
  );
  const [veterinarian, setVeterinarian] = useState(
    vaccineRecord?.veterinarian || ""
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    vaccineRecord?.additionalNotes || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

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

  async function onSaveEditRecord() {
    const updatedRecord = {
      vaccine: vaccine,
      dateAdministered: dateAdministered,
      nextBoosterDate: nextBoosterDate,
      veterinarian: veterinarian === "" ? "N/A" : veterinarian,
      additionalNotes: additionalNotes === "" ? "N/A" : additionalNotes,
    };

    setIsSaving(true);
    try {
      const respone = await editVaccine(vaccineRecord.vaccineId, updatedRecord);

      const updatedVaccineRecordLists = authContext.vaccines.map((vaccine) =>
        vaccine.vaccineId === vaccineRecord.vaccineId
          ? { ...vaccine, ...updatedRecord }
          : vaccine
      );

      authContext.setVaccines(updatedVaccineRecordLists, true);
      setSuccessModalVisible(true);
    } catch (error) {
      console.log(error);
    }
    setIsSaving(false);
  }

  function closeSuccessModal() {
    setVaccine("");
    setDateAdministered("");
    setNextBoosterDate("");
    setVeterinarian("");
    setAdditionalNotes("");
    setSuccessModalVisible(false);
    onClose();
  }

  if (!vaccineRecord) {
    return <LoadSpinner visible={isSaving} prompt="Just a moment..." />;
  }

  if (isSaving) {
    return (
      <LoadSpinner
        visible={isSaving}
        prompt="Updating vaccine record.... Please wait."
      />
    );
  }

  return (
    <>
      <Modal visible={visible} animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.content}>
              <View style={styles.closeButtonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>x</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.heading}>Edit Vaccine Record</Text>
              <Text style={styles.subheading}>
                Review and modify the vaccination details to maintain an
                accurate record.
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.vaccineInputContainer}>
                  <Text style={styles.inputLabel}>Select Vaccine </Text>
                  <DropdownComponent
                    options={commonDogVaccines}
                    placeholderText={vaccineRecord.vaccine}
                    onValueChange={onVaccineValueChange}
                  />
                </View>

                <View style={styles.administeredInputContainer}>
                  <DatePickerUI
                    customStyle={styles.datePickerInput}
                    textLabel="Administered "
                    onPress={onSelectDateAdministered}
                    placeholder={dateAdministered}
                  />
                </View>

                <View style={styles.nextBoosterInputContainer}>
                  <DatePickerUI
                    customStyle={styles.datePickerInput}
                    textLabel="Next Booster "
                    onPress={onSelectDateNextBooster}
                    placeholder={nextBoosterDate}
                  />
                </View>

                <View style={styles.textInputContainer}>
                  <Text style={styles.inputLabel}>Veterinarian</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Dr Smith (Happy Tails Vet Clinic)"
                    value={veterinarian}
                    onChangeText={onVeterinarianInputChange}
                  />
                </View>

                <View style={styles.textInputContainer}>
                  <Text style={styles.inputLabel}>
                    Additional Notes (optional)
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Mild swelling after injection."
                    value={additionalNotes}
                    onChangeText={onNoteInputChange}
                  />
                </View>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onSaveEditRecord}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
      <SuccessAnimation
        visible={successModalVisible}
        onClose={closeSuccessModal}
        successMessage="Vaccine updated successfully!"
      />
    </>
  );
}

export default EditVaccineForm;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 24,
  },

  content: {
    padding: 18,
    flex: 1,
  },

  heading: {
    fontFamily: "inter-bold",
    fontSize: 20,
    color: "#333333",
    textAlign: "center",
    marginVertical: 12,
  },
  subheading: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,

    marginBottom: 24,
  },

  closeButtonContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },

  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: "#F5F5F5",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#666666",
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
    marginBottom: 24,
  },

  cancelButton: {
    width: "45%",
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveButton: {
    width: "45%",
    backgroundColor: "#007BFF",
    paddingVertical: 16,
    borderRadius: 8,
    marginLeft: 8,
  },

  cancelButtonText: {
    fontFamily: "inter-regulaer",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },

  saveButtonText: {
    fontFamily: "inter-regulaer",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
