import LottieView from "lottie-react-native";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

function SelectDogProfile({
  visible,
  onClose,
  dogAccounts,
  onSelectDogProfile,
}) {
  function onPress(dogId, userId) {
    onSelectDogProfile(dogId, userId);
  }
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <Text style={styles.selectProfileText}>Select a dog profile</Text>
            {dogAccounts
              ? dogAccounts.map((dog) => (
                  <TouchableOpacity
                    key={dog.id}
                    onPress={() => onPress(dog.id, dog.userId)}
                    style={styles.accountContainer}
                  >
                    <View style={styles.profileContainer}>
                      <LottieView
                        autoPlay
                        source={require("../../assets/dog-face.json")}
                        style={styles.dogFace}
                      />
                    </View>
                    <View style={styles.dogNameContainer}>
                      <Text style={styles.dogName}>{dog.dogName}</Text>
                      <Text style={styles.dogBreed}>{dog.dogBreed}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              : null}
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelLoginButton}
            >
              <Text style={styles.cancelLoginText}>Cancel Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default SelectDogProfile;

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

  selectProfileText: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#333333",
    marginBottom: 16,
  },

  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
    marginBottom: 16,
  },

  profileContainer: {
    width: 50,
    height: 50,
    padding: 8,
    backgroundColor: "#A2D9FF",
    borderRadius: "100%",
  },

  dogFace: {
    width: "100%",
    height: "100%",
  },

  dogNameContainer: {
    marginLeft: 16,
  },

  dogName: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
  },

  dogBreed: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#666666",
  },

  cancelLoginButton: {
    padding: 16,
  },

  cancelLoginText: {
    fontFamily: "inter-regular",
    color: "#666666",
    textAlign: "center",
  },
});
