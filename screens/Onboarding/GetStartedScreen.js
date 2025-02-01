import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Modal,
  Linking,
} from "react-native";

import axios from "axios";

import { useState } from "react";

import Button from "../../components/UI/Button";
import ItemActionModal from "../../components/Modal/ItemActionModal";
import LoadSpinner from "../../components/Modal/LoadSpinner";
import { date } from "zod";

Linking.addEventListener("url", (event) => {
  const url = event.url;
  const queryParams = new URL(url).searchParams;
  const oobCode = queryParams.get("oobCode");
  const mode = queryParams.get("mode"); // e.g., 'verifyEmail'

  if (mode === "verifyEmail" && oobCode) {
    // confirmEmailVerification(oobCode);
    console.log(mode, oobCode);
  }
});

function GetStartedScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  async function onGetStartedPressed() {
    const apiKey = "AIzaSyBpWthhRHsu5TF4bgOL0ENOxrRRpzRMpO0";
    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;

    // try {
    //   const response = await axios.post(endpoint, payload);
    //   console.log(response.data);
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}
      `,
        {
          email: "naysumorphy@gmail.com",
          password: "kggdkp",
          returnSecureToken: true,
        }
      );

      const idToken = response.data.idToken;

      try {
        const payload = {
          requestType: "VERIFY_EMAIL",
          idToken: idToken,
        };
        const emailVerifyResponse = await axios.post(endpoint, payload);

        console.log(emailVerifyResponse.data);
      } catch (error) {
        console.log(error);
      }

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleOnFinishAnimation() {
    setIsButtonVisible(true);
  }

  function openModal() {
    setIsModalVisible(true);
  }

  function closeModal() {
    setIsModalVisible(false);
  }

  return (
    <View style={styles.safeAreaContainer}>
      <View style={styles.illustrationContainer}>
        <Image
          style={styles.illustrationGif}
          source={require("../../assets/gif/dog-high-five.png")}
        />
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeHeaderText}>Welcome to WoofWise!</Text>
          <Text style={styles.welcomeSubtitleText}>
            WoofWise helps you understand your dog's health better. Let's get
            started in keeping your dog healthy and happy!
          </Text>
          <Button onPress={onGetStartedPressed} size="large">
            <Text style={styles.buttonText}>Start Now</Text>
          </Button>
        </View>
      </View>

      <LoadSpinner visible={true} prompt="Loading please wait..." />
    </View>
  );
}

export default GetStartedScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },

  dogProfileContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "black",
  },

  illustrationContainer: {
    width: "100%",
    height: 350,
  },

  illustrationGif: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 50,
  },

  welcomeContainer: {
    alignItems: "center",
  },

  welcomeHeaderText: {
    fontFamily: "inter-bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 16,
    color: "#333333",
  },

  welcomeSubtitleText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
    color: "#666666",
    lineHeight: 28,
  },

  buttonCustomStyle: {
    width: "70%",
    alignSelf: "center",
    marginTop: 16,
    backgroundColor: "#0275D8",
  },

  buttonText: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
