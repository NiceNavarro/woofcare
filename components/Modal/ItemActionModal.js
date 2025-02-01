import LottieView from "lottie-react-native";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

function ItemActionModal({
  visible,
  onClose,
  onEdit,
  onDelete,
  onAddNote,
  promptAction,
  actionEdit,
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.callToActionText}>{promptAction}</Text>
            <View style={styles.actionButtonsContainer}>
              {actionEdit ? (
                <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={onAddNote} style={styles.editButton}>
                  <Text style={styles.buttonText}>Add Notes</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ItemActionModal;

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

  callToActionText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 30,
  },

  actionButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  editButton: {
    width: "45%",
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    borderRadius: 8,
  },
  deleteButton: {
    width: "45%",
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    marginLeft: 16,
    borderRadius: 8,
  },

  buttonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },
});
