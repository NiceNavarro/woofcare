import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

function UnsavedProcess({ visible, onLeave, onClose }) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <Text style={styles.modalTitle}>Unsaved Changes</Text>
            <Text style={styles.modalMessage}>
              You have unsaved changes. If you leave now, any progress you've
              made will not be saved. Would you like to continue the process?
            </Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.leaveButton} onPress={onLeave}>
                <Text style={styles.leaveButtonText}>Leave</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueButton} onPress={onClose}>
                <Text style={styles.continueButtontext}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default UnsavedProcess;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  content: {
    padding: 18,
  },

  modalTitle: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginBottom: 16,
  },

  modalMessage: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    lineHeight: 22,
    marginBottom: 20,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  leaveButton: {
    backgroundColor: "#d9534f",
    width: "50%",
    paddingVertical: 14,
    borderRadius: 6,
  },

  leaveButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },

  continueButton: {
    backgroundColor: "#0275d8",
    width: "50%",
    paddingVertical: 14,
    borderRadius: 6,
  },

  continueButtontext: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
