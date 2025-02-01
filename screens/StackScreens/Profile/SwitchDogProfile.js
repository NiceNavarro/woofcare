import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";

import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../../store/auth-context";
import LoadSpinner from "../../../components/Modal/LoadSpinner";
import ItemActionModal from "../../../components/Modal/ItemActionModal.js";

import {
  getUserById,
  getDogDetails,
  getDogDetails2,
  getDiagnoseHistory,
  getVaccinationRecords,
  getDiagnosisNotes,
  getVetVisitRecords,
  fetchDogs,
} from "../../../util/databaseFetch";

function SwitchDogProfile({ route }) {
  const authContext = useContext(AuthContext);
  const currentUserId = authContext.currentUserId;
  const currentDogId = authContext.currentDogId;
  const navigation = useNavigation();

  const dog = authContext.dogDetails;
  const allDogAccounts = route.params ? route.params.dogAccounts : null;
  const otherDogProfile = allDogAccounts.filter(
    (dog) => dog.id !== authContext.currentDogId
  );

  const [dogNametoSwitch, setDogNameToSwitch] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);

  async function onSwitchDogProfile(dogId, dogName) {
    setDogNameToSwitch(dogName);
    setIsSwitching(true);
    try {
      const dogDetails = await getDogDetails2(dogId, currentUserId);
      authContext.setDog(dogDetails);
      authContext.setDogId(dogDetails.id);

      const diagnoseHistory = await getDiagnoseHistory(
        currentUserId,
        dogDetails.id
      );
      const vaccineRecordLists = await getVaccinationRecords(
        currentUserId,
        dogDetails.id
      );
      const diagnosisNoteLists = await getDiagnosisNotes(
        currentUserId,
        dogDetails.id
      );
      const vetVisitRecords = await getVetVisitRecords(dogDetails.id);

      authContext.setDiagnosis(diagnoseHistory, true);
      authContext.setVaccines(vaccineRecordLists, true);
      authContext.setDiagnosisNotes(diagnosisNoteLists, true);
      authContext.setVetVisitRecords(vetVisitRecords, true);
      navigation.navigate("HomeStack");
    } catch (error) {
      console.log(error);
    }
    setIsSwitching(false);
  }

  function onLongPressProfile(dogId) {}

  return (
    <View style={styles.container}>
      <View style={styles.mainAccountContainer}>
        <View
          style={[
            styles.mainProfileContainer,
            !authContext.dogDetails.imageProfileUri && { padding: 16 },
          ]}
        >
          {authContext.dogDetails.imageProfileUri ? (
            <Image
              style={styles.image}
              source={{ uri: authContext.dogDetails.imageProfileUri }}
            />
          ) : (
            <LottieView
              autoPlay
              source={require("../../../assets/dog-face.json")}
              style={styles.dogFace}
            />
          )}
        </View>
        <View style={styles.mainProfileInfoContainer}>
          <Text style={styles.mainDogName}>{dog.dogName}</Text>
          <Text style={styles.mainDogBreed}>{dog.dogBreed}</Text>
          <Text style={styles.mainDogAge}>{dog.dogAge}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("DogRegistration", {
                addNewProfile: true,
              })
            }
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add New Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.profileListsContainer}
        showsVerticalScrollIndicator={false}
      >
        {otherDogProfile.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            onPress={() => onSwitchDogProfile(profile.id, profile.dogName)}
            onLongPress={() => onLongPressProfile(profile.id)}
            delayLongPress={200}
            style={styles.dogAccountContainer}
          >
            <View
              style={[
                styles.dogProfileContainer,
                !profile.imageProfileUri && { padding: 12 },
              ]}
            >
              {profile.imageProfileUri ? (
                <Image
                  style={styles.image}
                  source={{ uri: profile.imageProfileUri }}
                />
              ) : (
                <LottieView
                  autoPlay
                  source={require("../../../assets/dog-face.json")}
                  style={styles.dogFace}
                />
              )}
            </View>
            <View style={styles.dogProfileInfoContainer}>
              <Text style={styles.profileName}>{profile.dogName}</Text>
              <Text style={styles.profileBreed}>{profile.dogBreed}</Text>
              <Text style={styles.profileAge}>{profile.dogAge}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <LoadSpinner
        visible={isSwitching}
        prompt={`Switching to ${dogNametoSwitch}'s profile...`}
      />
    </View>
  );
}

export default SwitchDogProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },

  mainAccountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderBottomWidth: 0.5,
    borderColor: "#D3D3D3",
  },

  mainProfileContainer: {
    width: 100,
    height: 100,
    borderRadius: "100%",
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },

  dogFace: {
    width: "100%",
    height: "100%",
  },

  dogFace: {
    width: "100%",
    height: "100%",
  },

  mainProfileInfoContainer: {
    marginLeft: 18,
  },

  mainDogName: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginBottom: 4,
  },

  mainDogBreed: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    marginBottom: 4,
  },

  mainDogAge: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    marginBottom: 8,
  },

  addButton: {
    padding: 14,
    backgroundColor: "#007BFF",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  addButtonText: {
    fontFamily: "inter-regular",
    color: "#FFFFFF",
  },

  profileListsContainer: {
    flex: 1,
  },

  dogAccountContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 0.5,
    borderColor: "#D3D3D3",
    marginBottom: 16,
  },

  dogProfileContainer: {
    width: 70,
    height: 70,
    borderRadius: "100%",
    overflow: "hidden",
  },

  dogProfileInfoContainer: {
    marginLeft: 16,
  },

  profileName: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    marginBottom: 4,
  },

  profileBreed: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
  },

  profileAge: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#333333",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});
