import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";
import { AuthContext } from "../../../store/auth-context";
import { useState, useContext } from "react";
import {
  editDog,
  editDogProfileImage,
  removeDogProfileImage,
} from "../../../util/databasePatch";

import LoadSpinner from "../../../components/Modal/LoadSpinner";

import * as ImagePicker from "expo-image-picker";
import CameraPickOption from "../../../components/Modal/CameraPickOption";

const placeholderProfile = require("../../../assets/dog-face.json");

function DogProfile() {
  const authContext = useContext(AuthContext);
  const dogDetails = authContext.dogDetails;

  const [dogName, setDogName] = useState(dogDetails.dogName);
  const [dogBreed, setDogBreed] = useState(dogDetails.dogBreed);
  const [gender, setGender] = useState(dogDetails.dogGender);
  const [birthday, setBirthday] = useState(dogDetails.dogBirthday);
  const [age, setAge] = useState(dogDetails.dogAge);
  const [weight, setWeight] = useState(dogDetails.dogWeight);
  const [neuturedOrSpayed, setNeuteredOrSpayed] = useState(
    dogDetails.dogGender === "Male" ? dogDetails.neutered : dogDetails.spayed
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [imagePickerModalIsVisible, setImagePickerModalIsVisible] =
    useState(false);
  const [image, setImage] = useState();

  async function removeProfileImage() {
    try {
      const updatedData = { imageProfileUri: "" };
      await removeDogProfileImage(authContext.currentDogId, updatedData);

      authContext.setDog({
        ...authContext.dogDetails,
        ...updatedData,
      });

      setImagePickerModalIsVisible(false);
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
          await editDogProfileImage(authContext.currentDogId, updatedData);

          authContext.setDog({
            ...authContext.dogDetails,
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

  function onCancelEditProfile() {
    setIsEditing(false);
  }

  function onDogNameChange(value) {
    setDogName(value);
  }

  function onDogBreedChange(value) {
    setDogBreed(value);
  }

  function onDogGenderChange(value) {
    setGender(value);
  }

  function onBirthdayChange(value) {
    setBirthday(value);
  }

  function onAgeChange(value) {
    setAge(value);
  }

  function onWeightChange(value) {
    setWeight(value);
  }

  function onNeuteredOrSpayedChange(value) {
    setNeuteredOrSpayed(value);
  }

  async function onSaveChanges() {
    setIsFetching(true);
    try {
      const updatedData =
        gender === "Male"
          ? {
              dogName: dogName,
              dogBreed: dogBreed,
              dogGender: gender,
              dogBirthday: birthday,
              dogAge: age,
              dogWeight: weight,
              neutered: neuturedOrSpayed,
            }
          : {
              dogName: dogName,
              dogBreed: dogBreed,
              dogGender: gender,
              dogBirthday: birthday,
              dogAge: age,
              dogWeight: weight,
              spayed: neuturedOrSpayed,
            };

      await editDog(authContext.currentDogId, updatedData);
      authContext.setDog(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={() => setImagePickerModalIsVisible(true)}
          style={[
            authContext.dogDetails.imageProfileUri
              ? styles.imageContainer
              : styles.lottieViewContainer,
          ]}
        >
          {authContext.dogDetails.imageProfileUri ? (
            <Image
              style={styles.image}
              source={
                authContext.dogDetails.imageProfileUri
                  ? { uri: authContext.dogDetails.imageProfileUri }
                  : imageProfilePlaceHolder
              }
            />
          ) : (
            <LottieView
              autoPlay
              style={styles.image}
              source={placeholderProfile}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.dogName}>{dogDetails.dogName}</Text>
        <Text style={styles.breed}>{dogDetails.dogBreed}</Text>
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
        <Text style={styles.label}>Name</Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={dogName}
            onChangeText={onDogNameChange}
          />
        ) : (
          <View style={styles.detailContainer}>
            <Text style={styles.detailText}>{dogDetails.dogName}</Text>
          </View>
        )}

        <Text style={styles.label}>Breed</Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={dogBreed}
            onChangeText={onDogBreedChange}
          />
        ) : (
          <View style={styles.detailContainer}>
            <Text style={styles.detailText}>{dogDetails.dogBreed}</Text>
          </View>
        )}

        <Text style={styles.label}>Gender</Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={gender}
            onChangeText={onDogGenderChange}
          />
        ) : (
          <View style={styles.detailContainer}>
            <Text style={styles.detailText}>{dogDetails.dogGender}</Text>
          </View>
        )}

        <Text style={styles.label}>Birthday</Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={birthday}
            onChangeText={onBirthdayChange}
          />
        ) : (
          <View style={styles.detailContainer}>
            <Text style={styles.detailText}>{dogDetails.dogBirthday}</Text>
          </View>
        )}

        <Text style={styles.label}>Age</Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={age}
            onChangeText={onAgeChange}
          />
        ) : (
          <View style={styles.detailContainer}>
            <Text style={styles.detailText}>{dogDetails.dogAge}</Text>
          </View>
        )}

        <Text style={styles.label}>Weight (kg)</Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={weight}
            onChangeText={onWeightChange}
          />
        ) : (
          <View style={styles.detailContainer}>
            <Text style={styles.detailText}>{dogDetails.dogWeight}</Text>
          </View>
        )}

        <Text style={styles.label}>
          {dogDetails.dogGender === "Male" ? "Neutured" : "Spayed"}
        </Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={neuturedOrSpayed}
            onChangeText={onNeuteredOrSpayedChange}
          />
        ) : (
          <View style={[styles.detailContainer, { marginBottom: 60 }]}>
            <Text style={styles.detailText}>
              {dogDetails.dogGender === "Male"
                ? dogDetails.neutered
                : dogDetails.spayed}
            </Text>
          </View>
        )}

        {isEditing ? (
          <View style={styles.saveCancelContainer}>
            <TouchableOpacity
              onPress={onCancelEditProfile}
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
      <LoadSpinner
        visible={isFetching}
        prompt="Saving changes... Please wait."
      />
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

export default DogProfile;

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

  lottieViewContainer: {
    width: 100,
    height: 100,
    borderRadius: "100%",
    overflow: "hidden",
    marginBottom: 12,
    padding: 24,
    backgroundColor: "#E8E9EB",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dogName: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginBottom: 6,
  },

  breed: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
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

  label: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
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

  saveCancelContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 60,
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
