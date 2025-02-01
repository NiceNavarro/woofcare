import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import LoadSpinner from "../../../components/Modal/LoadSpinner";
import CameraPickOption from "../../../components/Modal/CameraPickOption";

import { useContext, useState } from "react";
import { AuthContext } from "../../../store/auth-context";

import {
  editUser,
  editUserProfileImage,
  removeUserProfileImage,
} from "../../../util/databasePatch";

const imageProfilePlaceHolder = require("../../../assets/userprofile.png");

function UserProfile() {
  const authContext = useContext(AuthContext);
  const user = authContext.userDetails;

  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [imagePickerModalIsVisible, setImagePickerModalIsVisible] =
    useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [image, setImage] = useState();

  async function removeProfileImage() {
    try {
      const updatedData = { imageProfileUri: "" };
      await removeUserProfileImage(authContext.currentUserId, updatedData);

      authContext.setUserAccountDetails({
        ...authContext.userDetails,
        ...updatedData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function saveImage(image) {
    try {
      //update displayed image
      setImage(image);
      setImagePickerModalIsVisible(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadImage(mode) {
    try {
      let result = {};

      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();

        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        //save image
        const profileImageUri = result.assets[0].uri;
        await saveImage(profileImageUri);

        try {
          const updatedData = { imageProfileUri: profileImageUri };
          await editUserProfileImage(authContext.currentUserId, updatedData);

          authContext.setUserAccountDetails({
            ...authContext.userDetails,
            ...updatedData,
          });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  function onEditProfile() {
    setIsEditing(true);
  }

  function onChangeFirstName(value) {
    setFirstName(value);
  }

  function onChangeLastName(value) {
    setLastName(value);
  }

  function onChangeEmail(value) {
    setEmail(value);
  }

  async function onSaveChanges() {
    setIsFetching(true);
    try {
      const updatedData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };
      await editUser(user.id, updatedData);
      authContext.setUserAccountDetails(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  }

  function onCancelChanges() {
    setIsEditing(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => setImagePickerModalIsVisible(true)}
        >
          <Image
            style={styles.image}
            source={
              authContext.userDetails.imageProfileUri
                ? { uri: authContext.userDetails.imageProfileUri }
                : imageProfilePlaceHolder
            }
          />
        </TouchableOpacity>
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={onEditProfile} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        style={styles.profileContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContent}>
          {isEditing ? (
            <>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="First Name"
                value={firstName}
                autoFocus={true}
                onChangeText={onChangeFirstName}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.detailContainer}>
                <Text style={styles.detailText}>{user.firstName}</Text>
              </View>
            </>
          )}

          {isEditing ? (
            <>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Last Name"
                value={lastName}
                onChangeText={onChangeLastName}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.detailContainer}>
                <Text style={styles.detailText}>{user.lastName}</Text>
              </View>
            </>
          )}

          {isEditing ? (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={email}
                keyboardType="email-address"
                onChangeText={onChangeEmail}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>Email</Text>
              <View style={styles.detailContainer}>
                <Text style={styles.detailText}>{user.email}</Text>
              </View>
            </>
          )}
        </View>

        {isEditing ? (
          <View style={styles.saveCancelContainer}>
            <TouchableOpacity
              onPress={onCancelChanges}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSaveChanges}
              style={styles.saveChangesButton}
            >
              <Text style={styles.saveChangesText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
      <LoadSpinner visible={isFetching} prompt="Saving changes..." />
      <CameraPickOption
        visible={imagePickerModalIsVisible}
        onClose={() => setImagePickerModalIsVisible(false)}
        onCameraPress={() => uploadImage()}
        onGalleryPress={() => uploadImage("gallery")}
        onRemoveProfileImage={removeProfileImage}
      />
    </View>
  );
}

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    paddingTop: 24,
  },

  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F5F5F5",
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  name: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginBottom: 6,
  },

  email: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },

  editButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    width: "40%",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  editButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },

  profileContentContainer: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  label: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },

  detailContainer: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 24,
  },

  detailText: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#666666",
  },

  textInput: {
    fontFamily: "inter-regular",
    fontSize: 16,
    backgroundColor: "#E8E9EB",
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#007BFF",

    // shadow
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Shadow for Android
    elevation: 3,
  },

  saveCancelContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  saveChangesButton: {
    width: "45%",
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginLeft: 16,
  },

  cancelButton: {
    width: "45%",
    padding: 16,
    backgroundColor: "#E8E9EB",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  cancelText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },

  saveChangesText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
