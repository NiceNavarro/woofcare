import { View, Text, Modal, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

function SuccessAnimation({ visible, onClose, successMessage }) {
  function handleAnimationFinish() {
    onClose();
  }
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
                source={require("../../assets/check-successful.json")}
                autoPlay
                loop={false}
                style={styles.checkAnimation}
                onAnimationFinish={handleAnimationFinish}
              />
              <Text style={styles.promptText}>{successMessage}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default SuccessAnimation;

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
    width: 75,
    height: 75,
    marginVertical: 12,
  },
  promptText: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: 16,
    lineHeight: 24,
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
