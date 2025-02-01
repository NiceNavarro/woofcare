import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

function CameraPickOption({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
  onRemoveProfileImage,
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <Text style={styles.profilePhotoText}>Profile Photo</Text>
            <View style={styles.cameraOptionsContainer}>
              <TouchableOpacity
                onPress={onCameraPress}
                style={styles.cameraOptionButton}
              >
                <Image
                  source={require("../../assets/camera.png")}
                  style={styles.icon}
                />
                <Text style={styles.camerOptionLabel}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraOptionButton}
                onPress={onGalleryPress}
              >
                <Image
                  source={require("../../assets/gallery.png")}
                  style={styles.icon}
                />
                <Text style={styles.camerOptionLabel}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onRemoveProfileImage}
                style={styles.cameraOptionButton}
              >
                <Image
                  source={require("../../assets/trashbin.png")}
                  style={styles.icon}
                />
                <Text style={styles.camerOptionLabel}>Remove</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default CameraPickOption;

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

  profilePhotoText: {
    fontFamily: "inter-bold",
    fontSize: 18,
    textAlign: "center",
    color: "#333333",
  },

  cameraOptionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },

  cameraOptionButton: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 8,
    margin: "auto",
  },

  camerOptionLabel: {
    fontFamily: "inter-regular",
    marginTop: 10,
    color: "#666666",
  },

  icon: {
    width: 30,
    height: 30,
    alignSelf: "center",
  },

  closeButton: {
    marginTop: 10,
  },

  closeButtonText: {
    fontFamily: "inter-regular",
    color: "#666666",
    textAlign: "center",
  },
});
