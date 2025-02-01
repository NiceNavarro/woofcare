import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

function UnsavedChangesModal({
  showWarningModal,
  handleCancelNavigation,
  handleContinueNavigation,
}) {
  if (!showWarningModal) {
    return null;
  }
  return (
    <Modal animationType="fade" visible={showWarningModal}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <View style={styles.contentWrapper}>
              <LottieView
                source={require("../../assets/warning.json")}
                autoPlay
                style={styles.warning}
              />
              <Text style={styles.diagnoseInProgress}>
                Diagnosis In Progress
              </Text>
              <Text style={styles.wishToContinue}>
                If you navigate away, the diagnosis process will be stopped. Do
                you wish to continue?
              </Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelNavigation}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinueNavigation}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default UnsavedChangesModal;

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
  warning: {
    width: 100,
    height: 100,
  },
  diagnoseInProgress: {
    fontFamily: "inter-bold",
    fontSize: 18,
    textAlign: "center",
    color: "#333333",
    marginBottom: 12,
  },

  wishToContinue: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#F5F5F5F5",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: "#F5F5F5F5",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
  },

  cancelButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
  },
  continueButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
  },
});
