import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

import { useState, useContext } from "react";
import LoadSpinner from "../Modal/LoadSpinner";
import { AuthContext } from "../../store/auth-context";

import { saveDiagnosisNotes } from "../../util/databasePost";

function AddNotesInput({ visible, onClose, selectedDiagnosisId }) {
  const authContext = useContext(AuthContext);
  const dog = authContext.dogDetails;

  const [note, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleNoteInputChange(newValue) {
    setNotes(newValue);
  }

  async function onAddNotes() {
    setIsSaving(true);
    try {
      const diagnosisNoteData = {
        diagnoseId: selectedDiagnosisId,
        dogId: authContext.currentDogId,
        userId: authContext.currentUserId,
        note: note,
      };

      const diagnosisNoteId = await saveDiagnosisNotes(diagnosisNoteData);
      const newData = {
        noteId: diagnosisNoteId,
        ...diagnosisNoteData,
      };

      authContext.setDiagnosisNotes([newData]);
      onClose();
    } catch (error) {
      console.log(error);
    }
    setIsSaving(false);
  }

  if (isSaving) {
    return <LoadSpinner visible={isSaving} prompt="Adding notes to..." />;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.heading}>Add note to this diagnosis.</Text>
            <Text style={styles.subheading}>
              Keep track of your thoughts, observations, or next steps related
              to your {dog.dogName}'s' health.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your notes here..."
              placeholderTextColor="#666666"
              multiline={true}
              numberOfLines={4}
              onChangeText={handleNoteInputChange}
            />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onAddNotes} style={styles.button}>
                <Text style={styles.buttonText}>Add Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default AddNotesInput;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalContainer: {
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

  heading: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    textAlign: "center",
    marginBottom: 12,
  },

  subheading: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },

  textInput: {
    fontFamily: "inter-regular",
    fontSize: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 6,
    color: "#333333",
  },

  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    width: "45%",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 6,
    marginLeft: 6,
  },

  buttonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },
});
