import { View, Text, Modal, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

function LoadSpinner({ visible, onClose, prompt }) {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <View style={styles.contentWrapper}>
              <LottieView
                source={require("../../assets/spinner.json")}
                autoPlay
                style={styles.spinner}
              />
              <Text style={styles.promptText}>{prompt}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default LoadSpinner;

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
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
  spinner: {
    width: 40,
    height: 40,
    marginTop: 16,
    marginBottom: 24,
  },
  promptText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    textAlignVertical: "center",
    marginLeft: 10,
  },
});
