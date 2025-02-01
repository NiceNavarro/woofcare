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
import { editVisitRecord } from "../../util/databasePatch";

function EditVetVisitForm({ visible, onClose, visitRecord }) {
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
  const [followUpDateVisit, setFollowUpDateVisit] = useState("");
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

  async function onSaveChanges() {
    if (
      vetName === "" ||
      clinicName === "" ||
      dateOfVisit === "" ||
      reasonForVisit === "" ||
      symptomsNoticed === "" ||
      diagnosedCondition === "" ||
      vetVisitCost === ""
    ) {
      Alert.alert(
        "Required Fields Missing",
        "You are currently editing this record. All required fields must be filled out before saving. Please ensure no required fields are left empty to proceed."
      );
      return;
    }

    const updatedData = {
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
      const recordId = await editVisitRecord(visitRecord.recordId, updatedData);

      const updatedRecordLists = authContext.vetVisitRecords.map((record) =>
        record.recordId === visitRecord.recordId
          ? { ...record, ...updatedData }
          : record
      );
      authContext.setVetVisitRecords(updatedRecordLists, true);
    } catch (error) {
      console.log("Error saving record: ", error);
    }
    setIsSaving(false);
    setIsSuccessModalVisible(true);
  }

  useEffect(() => {
    if (visitRecord) {
      setVetName(visitRecord.vetName || "");
      setClinicName(visitRecord.clinicName || "");
      setClinicAddress(visitRecord.clinicAddress || "");
      setClinicContactNumber(visitRecord.clinicContactNumber || "");
      setDateOfVisit(visitRecord.dateOfVisit || "");
      setReasonForVisit(visitRecord.reasonForVisit || "");
      setSymptomsNoticed(visitRecord.symptomsNoticed || "");
      setDiagnosedCondition(visitRecord.diagnosedCondition || "");
      setMedicationPrescribed(visitRecord.medicationPrescribed || "");
      setTreatmentDone(visitRecord.treatmentDone || "");
      setFollowUpDateVisit(visitRecord.followUpDateVisit || "");
      setNotesFromVet(visitRecord.notesFromVet);
      setVetVisitCost(visitRecord.vetVisitCost || "");
      setPersonalNotes(visitRecord.personalNotes || "");
    }
  }, [visitRecord]);

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
          <Text style={styles.heading}>Edit Vet Visit Record</Text>
          <Text style={styles.subHeading}>
            Review and modify the record details to maintain an accurate record.
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
                  value={vetName}
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
                  value={clinicName}
                />
              </View>

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Address (edit)</Text>
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
                  value={clinicAddress}
                />
              </View>

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Contact Number (edit)</Text>
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
                  value={clinicContactNumber}
                />
              </View>
            </View>

            <View style={styles.vetInformationArea}>
              <Text style={styles.inputTitle}>Visit Details</Text>

              <DatePickerUI
                textLabel="Date of Visit (required)"
                customStyle={styles.datePickerInput}
                onPress={onChangeDateVisit}
                placeholder={dateOfVisit}
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
                  value={reasonForVisit}
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
                  value={symptomsNoticed}
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
                  value={diagnosedCondition}
                />
              </View>

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Medication Prescribed (edit)</Text>
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
                  value={medicationPrescribed}
                />
              </View>
            </View>

            <View style={styles.vetInformationArea}>
              <Text style={styles.inputTitle}>Treatments & Follow-Up</Text>
              <View style={styles.textInputContainer}>
                <Text style={styles.label}>
                  Treatment/Procedure Done (edit)
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
                  value={treatmentDone}
                />
              </View>

              <DatePickerUI
                textLabel="Follow-Up Date  (edit)"
                customStyle={styles.datePickerInput}
                onPress={onChangeFollowUpVisit}
                placeholder={followUpDateVisit}
              />

              <View style={styles.textInputContainer}>
                <Text style={styles.label}>
                  Additional Notes from Vet (edit)
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
                  value={notesFromVet}
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
                  value={vetVisitCost}
                />
              </View>
            </View>

            <View style={styles.vetInformationArea}>
              <Text style={styles.inputTitle}>Optional Notes</Text>
              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Your Personal Notes (edit)</Text>
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
                  value={personalNotes}
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

            <TouchableOpacity onPress={onSaveChanges} style={styles.addButton}>
              <Text style={styles.addButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <LoadSpinner
        visible={isSaving}
        prompt="Updating your record... Please wait."
      />
      <SuccessAnimation
        visible={isSuccessModalVisible}
        successMessage="Record updated successfully!"
        onClose={onCloseSuccessModal}
      />
    </>
  );
}

export default EditVetVisitForm;

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
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#F5F5F5",
    textAlign: "center",
  },
});
