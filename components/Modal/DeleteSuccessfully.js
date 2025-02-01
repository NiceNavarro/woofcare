import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

function DeleteSuccessfully({ visible, onClose }) {
  return (
    <Modal animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <View style={styles.contentWrapper}>
              <LottieView
                source={require("../../assets/complete-check2.json")}
                autoPlay
                loop={false}
                style={styles.checkAnimation}
              />
              <Text style={styles.promptText}>Data deleted successfully!</Text>
              <TouchableOpacity style={styles.returnButton} onPress={onClose}>
                <Text style={styles.returnButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default DeleteSuccessfully;

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
    padding: 20,
  },
  contentWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkAnimation: {
    width: 100,
    height: 100,
  },
  promptText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    textAlign: "center",
    color: "#007BFF",
    marginBottom: 16,
  },

  returnButton: {
    width: "80%",
    marginVertical: 16,
    padding: 14,
    borderRadius: 6,
    backgroundColor: "#007BFF",
  },
  returnButtonText: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
