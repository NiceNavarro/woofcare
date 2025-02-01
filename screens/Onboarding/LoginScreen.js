import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../store/auth-context";

import Input from "../../components/Form/Input";
import LoadSpinner from "../../components/Modal/LoadSpinner";
import { login } from "../../util/auth";
import SelectDogProfile from "../../components/Modal/SelectDogProfile";
import {
  getUserById,
  getDogDetails,
  getDiagnoseHistory,
  getVaccinationRecords,
  getDiagnosisNotes,
  getVetVisitRecords,
  fetchDogs,
} from "../../util/databaseFetch";
import axios from "axios";
import { P } from "pino";

function LoginScreen() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState(
    "Logging in please wait..."
  );
  const [isSelectDogProfileVisible, setIsSelectDogProfileVisible] =
    useState(false);

  const [dogAccounts, setDogAccounts] = useState(null);
  const [selectedDogIdProfile, setSelectedDogProfileId] = useState("");

  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword() {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  }

  async function onLogin() {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      setIsAuthenticating(true);
      openSpinnerModal();
      try {
        const { authUserId } = await login(email, password);
        authContext.authenticate(authUserId);

        try {
          const user = await getUserById(authUserId);
          console.log(user);
          authContext.setUserAccountDetails(user);
          authContext.setUser(user.id);
          if (!user.hasCompletedDogSetup) {
            navigation.navigate("DogRegistration");
          } else {
            const dogAccountLists = await fetchDogs(user.id);

            setDogAccounts(dogAccountLists);
            setIsSelectDogProfileVisible(true);
          }
        } catch (error) {
          Alert.alert("Unable to Log In", error);
        }
      } catch (error) {
        Alert.alert(
          "Unable to Log In",
          "Your email or password is incorrect. Please verify your credentials and try again."
        );
      }
      setIsAuthenticating(false);
      closeSpinnerModal();
    }
  }

  function handleEmailInputChange(value) {
    setEmail(value);
  }

  function handlePasswordInputChange(value) {
    setPassword(value);
  }

  function onPressSignUp() {
    navigation.navigate("Signup");
  }

  function openSpinnerModal() {
    setIsSpinnerVisible(true);
  }

  function closeSpinnerModal() {
    setIsSpinnerVisible(false);
  }

  async function onSelectDogProfile(dogId, userId) {
    setSelectedDogProfileId(dogId);

    setIsAuthenticating(true);
    setSpinnerMessage("Just a moment...");
    try {
      const dogDetails = await getDogDetails(dogId, userId, dogAccounts);

      console.log(dogDetails);
      authContext.setDog(dogDetails);
      authContext.setDogId(dogDetails.id);
      const diagnoseHistory = await getDiagnoseHistory(userId, dogId);
      const vaccineRecordLists = await getVaccinationRecords(userId, dogId);
      const diagnosisNoteLists = await getDiagnosisNotes(userId, dogId);
      const vetVisitRecords = await getVetVisitRecords(dogId);
      authContext.setDiagnosis(diagnoseHistory);
      authContext.setVaccines(vaccineRecordLists);
      authContext.setDiagnosisNotes(diagnosisNoteLists);
      authContext.setVetVisitRecords(vetVisitRecords);
      setIsSelectDogProfileVisible(false);
      navigation.navigate("MainTabs");
    } catch (error) {
      console.log(error);
    }
    setIsAuthenticating(false);
  }

  async function onForgotPassword() {
    navigation.navigate("ResetPasswordEmailVerification");
  }

  return (
    <View style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.createAccountText}>Welcome Back!</Text>
        <Text style={styles.fillDetailsText}>
          Log in with your email and password, or create an account below.
        </Text>

        <View style={styles.inputsContainer}>
          {emailError ? (
            <Text style={styles.errorTextMessage}>{emailError}</Text>
          ) : null}
          <Input
            onChangeText={handleEmailInputChange}
            value={email}
            placeholder="Email"
            hasError={!!emailError}
            inputMode="email"
          />

          {passwordError ? (
            <Text style={styles.errorTextMessage}>{passwordError}</Text>
          ) : null}
          <Input
            isPassword={true}
            onChangeText={handlePasswordInputChange}
            value={password}
            placeholder="Password"
            hasError={!!passwordError}
          />

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={onForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onLogin} style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.dontHaveAccountContainer}>
            <Text style={styles.dontHaveAccountText}>
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={onPressSignUp}
              style={styles.signUpButton}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          {/* 
          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={require("../../assets/googleLogo.png")}
              style={styles.accountLogo}
            />
            <Text style={styles.googleButtonText}>Sign with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.facebookButton}>
            <Image
              source={require("../../assets/facebookLogo.png")}
              style={styles.accountLogo}
            />
            <Text style={styles.facebookButtonText}>Signin with Facebook</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <LoadSpinner visible={isAuthenticating} prompt={spinnerMessage} />
      <SelectDogProfile
        visible={isSelectDogProfileVisible}
        dogAccounts={dogAccounts || []}
        onSelectDogProfile={onSelectDogProfile}
        onClose={() => {
          setIsSelectDogProfileVisible(false);
        }}
      />
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#F7F7F7",
  },

  headerContainer: {
    marginTop: 32,
  },

  createAccountText: {
    fontFamily: "inter-bold",
    fontSize: 24,
    textAlign: "center",
    color: "#333333",
    marginBottom: 8,
  },

  fillDetailsText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
    lineHeight: 26,
  },

  inputsContainer: {
    marginTop: 48,
  },

  button: {
    paddingVertical: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },

  buttonText: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    textAlign: "center",
    color: "#ffffff",
  },

  errorTextMessage: {
    fontFamily: "inter-regular",
    fontSize: 12,
    marginBottom: 12,
    color: "#D00E17",
  },

  dontHaveAccountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 28,
  },

  dontHaveAccountText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
  },

  signUpText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#0275D8",
    marginLeft: 4,
  },

  orContinueWithContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 24,
  },

  horizontalLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },

  orTextLabel: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#888888",
  },

  continueWithContainer: {
    marginTop: 32,
  },

  continueWithButton: {
    flexDirection: "row",
    alignItem: "center",
    fontFamily: "inter-regular",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    marginBottom: 16,
    borderRadius: 12,
  },

  continueWithText: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
  },

  googleImage: {
    marginRight: 24,
  },

  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },

  facebookButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
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

  googleButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    marginLeft: 8,
  },

  facebookButtonText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    marginLeft: 8,
  },

  accountLogo: {
    width: 32,
    height: 32,
  },

  forgotPasswordButton: {
    alignItems: "flex-end",
    marginBottom: 24,
  },

  forgotPasswordText: {
    fontFamily: "inter-medium",
    color: "#0275D8",
  },
});
