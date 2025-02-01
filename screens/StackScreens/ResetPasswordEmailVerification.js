import {
  View,
  Text,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import { useState } from "react";
import axios from "axios";
import { FIREBASE_API_KEY } from "../../api/apiKey";

const ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`;

function ResetPasswordEmailVerification({ navigation }) {
  const [email, setEmail] = useState("");

  function checkEmailValid() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function onChangeEmailInput(newValue) {
    setEmail(newValue);
  }

  async function onSendResetLink() {
    const emailIsValid = checkEmailValid();

    if (!emailIsValid) {
      Alert.alert(
        "Invalid Email Address",
        "Please enter a valid email address."
      );
    } else {
      const alertTitle = "Password Reset Email Sent";
      const alertMessage =
        "We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password. Once done, come back here to log in again.";

      const payload = {
        requestType: "PASSWORD_RESET",
        email: email,
      };

      try {
        const response = await axios.post(ENDPOINT, payload);
        Alert.alert(alertTitle, alertMessage);
        console.log(response.data);
        navigation.goBack();
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Reset Your Password</Text>
      <Text style={styles.subheader}>
        Enter your email address below, and we'll send you a link to reset your
        password
      </Text>
      <TextInput
        style={styles.emailInput}
        placeholder="Enter your email address"
        keyboardType="email-address"
        value={email}
        onChangeText={onChangeEmailInput}
      />
      <TouchableOpacity
        style={styles.sendResetButton}
        onPress={onSendResetLink}
      >
        <Text style={styles.sendResetButtonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ResetPasswordEmailVerification;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#F5F5F5",
  },

  header: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
  },

  subheader: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
  },

  emailInput: {
    fontFamily: "inter-regular",
    fontSize: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    borderRadius: 8,
    marginBottom: 24,
  },

  sendResetButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },

  sendResetButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
