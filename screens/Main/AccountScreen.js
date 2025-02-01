import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";

import { useState, useContext } from "react";
import { fetchDogs } from "../../util/databaseFetch";
import LoadSpinner from "../../components/Modal/LoadSpinner";

import { AuthContext } from "../../store/auth-context";

const userIcon = require("../../assets/user-icon.png");
const dogFaceIcon = require("../../assets/dog-face-icon.png");
const pawIcon = require("../../assets/paw-icon.png");
const logoutIcon = require("../../assets/logout.png");

function AccountScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const [isFetching, setIsFetching] = useState(false);

  async function onNavigateSwitchProfile() {
    setIsFetching(true);

    try {
      const dogAccounts = await fetchDogs(authContext.currentUserId);
      navigation.navigate("SwitchDogProfile", {
        dogAccounts: dogAccounts,
      });
    } catch (error) {
      console.log(error);
    }

    setIsFetching(false);
  }

  function onLogout() {
    navigation.navigate("AuthScreen");
    authContext.logout();
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.profileLabel}>Profile</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("UserProfile")}
          style={styles.profileButton}
        >
          <Image source={userIcon} style={styles.icon} />
          <Text style={styles.profileText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("DogProfile")}
          style={styles.profileButton}
        >
          <Image source={dogFaceIcon} style={styles.icon} />
          <Text style={styles.profileText}>My Dog's Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNavigateSwitchProfile}
          style={styles.profileButton}
        >
          <Image source={pawIcon} style={styles.icon} />
          <Text style={styles.profileText}>Switch / Add Dog's Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogout} style={styles.profileButton}>
          <Image source={logoutIcon} style={styles.icon} />
          <Text style={styles.profileText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <LoadSpinner visible={isFetching} prompt="Just a moment..." />
    </View>
  );
}

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  profileContainer: {
    marginTop: 32,
  },

  profileButton: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#E8E9EB",
    padding: 16,
    marginBottom: 16,
    borderRadius: 6,
  },

  profileText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    marginLeft: 16,
  },
  profileLabel: {
    fontFamily: "inter-medium",
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },

  icon: {
    width: 22,
    height: 22,
  },
});
