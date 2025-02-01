import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

function DiagnoseInProgressModal({ isVisible }) {
  return (
    <Modal animationType="fade" visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <View style={styles.contentWrapper}>
              <LottieView
                source={require("../../assets/dog-inside-box.json")}
                autoPlay
                style={styles.animation}
              />
              <Text style={styles.heading}>Diagnosis in Progress...</Text>
              <Text style={styles.textMessage}>
                Analyzing your dog's symptoms. This might take a moment—thank
                you for your patience!
              </Text>
              <LottieView
                source={require("../../assets/dot-loader-grey.json")}
                autoPlay
                style={styles.loader}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default DiagnoseInProgressModal;

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
  animation: {
    width: 120,
    height: 120,
    marginBottom: 4,
  },
  loader: {
    width: 100,
    height: 100,
  },
  heading: {
    fontFamily: "inter-bold",
    fontSize: 18,
    textAlign: "center",
    color: "#333333",
    marginBottom: 12,
  },

  textMessage: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
});
