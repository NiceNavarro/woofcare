import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import { AuthContext } from "../../store/auth-context";

import DatePickerUI from "../UI/DatePickerUI";
import SuccessAnimation from "../Modal/SuccessAnimation";
import { saveVetVisitRecord } from "../../util/databasePost";
import LoadSpinner from "../Modal/LoadSpinner";

function VetVisitForm({ visible, onClose }) {
  // form input state
  const [vetName, setVetName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicContactNumber, setClinicContactNumber] = useState("");
  const [dateOfVisit, setDateOfVisit] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [symptomsNoticed, setSymptomsNoticed] = useState("");
  const [diagnosedCondition, setDiagnosedCondition] = useState("");
  const [medicationPrescribed, setMedicationPrescribed] = useState("");
  const [treatmentDone, setTreatmentDone] = useState("");
  const [followUpDateVisit, setFollowUpDateVisit] = useState();
  const [notesFromVet, setNotesFromVet] = useState("");
  const [vetVisitCost, setVetVisitCost] = useState("");
  const [personalNotes, setPersonalNotes] = useState("");

  // input active focus
  const [focusedInput, setFocusedInput] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const authContext = useContext(AuthContext);

  function onChangeVetName(value) {
    setVetName(value);
  }

  function onChangeClinicName(value) {
    setClinicName(value);
  }

  function onChangeClinicAddress(value) {
    setClinicAddress(value);
  }

  function onChangeClinicContact(value) {
    setClinicContactNumber(value);
  }

  function onChangeDateVisit(value) {
    setDateOfVisit(value);
  }

  function onChangeReasonForVisit(value) {
    setReasonForVisit(value);
  }

  function onChangeSymptomsNotied(value) {
    setSymptomsNoticed(value);
  }

  function onChangeDiagnosedCondition(value) {
    setDiagnosedCondition(value);
  }

  function onChangeMedicationPrescribed(value) {
    setMedicationPrescribed(value);
  }

  function onChangeTreatmentDone(value) {
    setTreatmentDone(value);
  }

  function onChangeFollowUpVisit(value) {
    setFollowUpDateVisit(value);
  }

  function onChangeNotesFromVet(value) {
    setNotesFromVet(value);
  }

  function onChangeVisitCost(value) {
    setVetVisitCost(value);
  }

  function onChangePersonalNotes(value) {
    setPersonalNotes(value);
  }

  function onCloseModalForm() {
    resetStateToDefault();
    onClose();
  }

  function onCloseSuccessModal() {
    setIsSuccessModalVisible(false);
    onCloseModalForm();
  }

  function resetStateToDefault() {
    setVetName("");
    setClinicName("");
    setClinicAddress("");
    setClinicContactNumber("");
    setDateOfVisit("");
    setReasonForVisit("");
    setSymptomsNoticed("");
    setDiagnosedCondition("");
    setMedicationPrescribed("");
    setTreatmentDone("");
    setFollowUpDateVisit("");
    setNotesFromVet("");
    setVetVisitCost("");
    setPersonalNotes("");
    setFocusedInput("");
  }

  async function onAddVisitRecord() {
    if (
      vetName === "" ||
      clinicName === "" ||
      dateOfVisit === "" ||
      reasonForVisit === "" ||
      symptomsNoticed === "" ||
      diagnosedCondition === "" ||
      vetVisitCost === "" ||
      followUpDateVisit === ""
    ) {
      Alert.alert(
        "Incomplete Form",
        "Please ensure all required fields are filled out before proceeding."
      );
      return;
    }

    const recordInputs = {
      dogId: authContext.currentDogId,
      vetName: vetName,
      clinicName: clinicName,
      clinicAddress: clinicAddress === "" ? "N/A" : clinicAddress,
      clinicContactNumber:
        clinicContactNumber === "" ? "N/A" : clinicContactNumber,
      dateOfVisit: dateOfVisit,
      reasonForVisit: reasonForVisit,
      symptomsNoticed: symptomsNoticed,
      diagnosedCondition: diagnosedCondition,
      medicationPrescribed:
        medicationPrescribed === "" ? "N/A" : medicationPrescribed,
      treatmentDone: treatmentDone === "" ? "N/A" : treatmentDone,
      followUpDateVisit: followUpDateVisit === "" ? "N/A" : followUpDateVisit,
      notesFromVet: notesFromVet === "" ? "N/A" : notesFromVet,
      vetVisitCost: vetVisitCost,
      personalNotes: personalNotes === "" ? "N/A" : personalNotes,
    };
    setIsSaving(true);
    try {
      const recordId = await saveVetVisitRecord(recordInputs);
      const newRecordWithId = {
        recordId: recordId,
        ...recordInputs,
      };
      authContext.setVetVisitRecords([newRecordWithId]);
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.log("Error saving record: ", error);
    }
    setIsSaving(false);
  }

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onCloseModalForm}
      >
        <View style={styles.content}>
          <TouchableOpacity
            onPress={onCloseModalForm}
            style={styles.backButtonContainer}
          >
            <Image
              style={styles.leftArrowIcon}
              source={require("../../assets/arrow-left.png")}
            />
            <Text style={styles.goBackText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Log a Vet Visit</Text>
          <Text style={styles.subHeading}>
            Keep your dog's health history organized. Record visit details to
            track diagnoses, treatments, and follow-ups for better care.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.vetInformationArea}>
              <Text style={styles.inputTitle}>Vet's Information</Text>
              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Vet's Name (required)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "vetNameInput" && styles.inputFocused,
                  ]}
                  placeholder="Dr. Smith"
                  onFocus={() => setFocusedInput("vetNameInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangeVetName}
                />
              </View>
              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Clinic Name (required)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "clinicNameInput" && styles.inputFocused,
                  ]}
                  placeholder="Happy Tails Veterinary Clinic"
                  onFocus={() => setFocusedInput("clinicNameInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangeClinicName}
                />
              </View>

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Address (optional)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "clinicAddressInput" &&
                      styles.inputFocused,
                  ]}
                  placeholder="1234 Bark Street, Dogtown"
                  onFocus={() => setFocusedInput("clinicAddressInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangeClinicAddress}
                />
              </View>

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Contact Number (optional)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "clinicContactInput" &&
                      styles.inputFocused,
                  ]}
                  placeholder="+63 987-654-321"
                  onFocus={() => setFocusedInput("clinicContactInput")}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="number-pad"
                  onChangeText={onChangeClinicContact}
                />
              </View>
            </View>

            <View style={styles.vetInformationArea}>
              <Text style={styles.inputTitle}>Visit Details</Text>

              <DatePickerUI
                textLabel="Date of Visit (required)"
                customStyle={styles.datePickerInput}
                onPress={onChangeDateVisit}
              />

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Reason for Visit (required)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "reasonForVisitInput" &&
                      styles.inputFocused,
                  ]}
                  placeholder="Check-up, vaccination etc."
                  onFocus={() => setFocusedInput("reasonForVisitInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangeReasonForVisit}
                />
              </View>

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Symptoms Noticed (required)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "symptomsNoticedInput" &&
                      styles.inputFocused,
                  ]}
                  placeholder="Vomiting, lethargy, itching etc."
                  onFocus={() => setFocusedInput("symptomsNoticedInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangeSymptomsNotied}
                />
              </View>

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Diagnosed Condition (required)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "diagnosedConditionInput" &&
                      styles.inputFocused,
                  ]}
                  placeholder="Ear infection, kennel cough etc."
                  onFocus={() => setFocusedInput("diagnosedConditionInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangeDiagnosedCondition}
                />
              </View>

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>
                  Medication Prescribed (optional)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "medicationPrescribedInput" &&
                      styles.inputFocused,
                  ]}
                  placeholder="Antibiotics, ear drops etc."
                  onFocus={() => setFocusedInput("medicationPrescribedInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangeMedicationPrescribed}
                />
              </View>
            </View>

            <View style={styles.vetInformationArea}>
              <Text style={styles.inputTitle}>Treatments & Follow-Up</Text>
              <View style={styles.textInputContainer}>
                <Text style={styles.label}>
                  Treatment/Procedure Done (optional)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "treatmentDoneInput" &&
                      styles.inputFocused,
                  ]}
                  placeholder="Vaccination, minor surgery etc."
                  onFocus={() => setFocusedInput("treatmentDoneInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangeTreatmentDone}
                />
              </View>

              <DatePickerUI
                textLabel="Follow-Up Date  (required)"
                customStyle={styles.datePickerInput}
                onPress={onChangeFollowUpVisit}
              />

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>
                  Additional Notes from Vet (optional)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "notesFromVetInput" && styles.inputFocused,
                  ]}
                  placeholder="Diet change, monitor hydration, etc."
                  onFocus={() => setFocusedInput("notesFromVetInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangeNotesFromVet}
                />
              </View>
            </View>

            <View style={styles.vetInformationArea}>
              <Text style={styles.inputTitle}>Vet Visit Cost</Text>
              <View style={styles.textInputContainer}>
                <Text style={styles.label}>
                  Total Cost of Visit (PHP) (required)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "visitCostInput" && styles.inputFocused,
                  ]}
                  placeholder="500"
                  onFocus={() => setFocusedInput("visitCostInput")}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="numeric"
                  onChangeText={onChangeVisitCost}
                />
              </View>
            </View>

            <View style={styles.vetInformationArea}>
              <Text style={styles.inputTitle}>Optional Notes</Text>
              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Your Personal Notes (optional)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedInput === "personalNotesInput" &&
                      styles.inputFocused,
                  ]}
                  placeholder="Bella was nervous but did well during the visit."
                  multiline={true}
                  onFocus={() => setFocusedInput("personalNotesInput")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={onChangePersonalNotes}
                />
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={onCloseModalForm}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onAddVisitRecord}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <SuccessAnimation
        visible={isSuccessModalVisible}
        successMessage="Your new vet visit record has been successfully added."
        onClose={onCloseSuccessModal}
      />
      <LoadSpinner
        visible={isSaving}
        prompt="Saving your record, please wait..."
      />
    </>
  );
}

export default VetVisitForm;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 24,
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
    marginBottom: 30,
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

  dateOfVisit: {
    marginTop: 24,
  },

  datePickerInput: {
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
  },

  textInput: {
    fontFamily: "inter-regular",
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 16,
  },

  inputFocused: {
    borderColor: "#007BFF", // Active border color
    borderWidth: 2, // Slightly thicker border for focus
  },

  label: {
    fontFamily: "inter-regular",
    color: "#666666",
    marginBottom: 8,
  },

  textInputContainer: {
    marginBottom: 30,
  },

  vetInformationArea: {
    marginVertical: 16,
  },

  inputTitle: {
    fontFamily: "inter-bold",
    fontSize: 20,
    color: "#333333",
    marginBottom: 16,
  },

  buttonsContainer: {
    marginVertical: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButton: {
    width: "45%",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },

  addButton: {
    width: "45%",
    padding: 16,
    backgroundColor: "#007BFF",
    borderRadius: 6,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },

  cancelButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },

  addButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#F5F5F5",
    textAlign: "center",
  },
});
