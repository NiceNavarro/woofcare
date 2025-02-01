import {
  View,
  Text,
  Platform,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useState, useRef, useContext } from "react";

import Input from "../../components/Form/Input";
import LoadSpinner from "../../components/Modal/LoadSpinner";

import { AuthContext } from "../../store/auth-context";

import { createUser } from "../../util/auth";
import { storeUser } from "../../util/databasePost";

function SignUpScreen({ navigation }) {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmedPasswordError, setConfirmedPasswordError] = useState("");

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authContext = useContext(AuthContext);

  const [currentFormContent, setCurrentFormContent] =
    useState("userFullNameInputs");

  const slideAnim = useRef(new Animated.Value(0)).current;

  const userNameFormContent = (
    <View style={styles.userNameInputsContainer}>
      {firstNameError ? (
        <Text style={styles.errorMessage}>{firstNameError}</Text>
      ) : null}
      <Input
        onChangeText={handleFirstNameInputChange}
        value={userData.firstName}
        customStyle={styles.firstNameInput}
        placeholder="First Name"
        hasError={!!firstNameError}
      />

      {lastNameError ? (
        <Text style={styles.errorMessage}>{lastNameError}</Text>
      ) : null}
      <Input
        onChangeText={handleLastNameInputChange}
        value={userData.lastName}
        customStyle={styles.lastNameInput}
        placeholder="Last Name"
        hasError={!!lastNameError}
      />

      {userData.firstName !== "" || userData.lastName !== "" ? (
        <TouchableOpacity
          style={styles.button}
          onPress={onUserNameSubmission}
          size="large"
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      ) : undefined}
    </View>
  );

  const userEmailPasswordContent = (
    <View style={styles.emailPasswordContainer}>
      {emailError ? (
        <Text style={styles.errorMessage}>{emailError}</Text>
      ) : null}
      <Input
        onChangeText={handleEmailInputChange}
        customStyle={styles.email}
        placeholder="Email"
        inputMode="email"
        hasError={!!emailError}
        value={userData.email}
      />

      {passwordError ? (
        <Text style={styles.errorMessage}>{passwordError}</Text>
      ) : null}
      <Input
        onChangeText={handlePasswordInputChange}
        customStyle={styles.password}
        placeholder="Password"
        isPassword={true}
        hasError={!!passwordError}
        value={userData.password}
      />

      {confirmedPasswordError ? (
        <Text style={styles.errorMessage}>{confirmedPasswordError}</Text>
      ) : null}
      <Input
        onChangeText={handleConfirmedPasswordInputChange}
        customStyle={styles.confirmPassword}
        placeholder="Confirm Password"
        isPassword={true}
        hasError={!!confirmedPasswordError}
        value={userData.confirmedPassword}
      />
      {userData.email !== "" ||
      userData.password !== "" ||
      userData.confirmedPassword !== "" ? (
        <TouchableOpacity style={styles.button} onPress={onSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      ) : undefined}
    </View>
  );

  function slideInContent() {
    // Animate to slide out current content to the left
    Animated.timing(slideAnim, {
      toValue: -300, // Slide current content out of the screen
      duration: 200,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCurrentFormContent("userEmailPasswordInputs"); // Update the content after sliding out
      slideAnim.setValue(300); // Start the new content off-screen on the right

      // Slide the new content in from right to center
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }

  function handleFirstNameInputChange(value) {
    setUserData((previousUserData) => ({
      ...previousUserData,
      firstName: value,
    }));
  }

  function handleLastNameInputChange(value) {
    setUserData((previousUserData) => ({
      ...previousUserData,
      lastName: value,
    }));
  }

  function handleEmailInputChange(value) {
    setUserData((previousUserData) => ({
      ...previousUserData,
      email: value,
    }));
  }

  function handlePasswordInputChange(value) {
    setUserData((previousUserData) => ({
      ...previousUserData,
      password: value,
    }));
  }

  function handleConfirmedPasswordInputChange(value) {
    setUserData((previousUserData) => ({
      ...previousUserData,
      confirmedPassword: value,
    }));
  }

  function onUserNameSubmission() {
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();

    if (isFirstNameValid && isLastNameValid) {
      slideInContent();
    } else {
      alert("Invalid first name or last name");
    }
  }

  async function onSignUp() {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmedPasswordValid = validateConfirmedPassword();

    if (isEmailValid && isPasswordValid && isConfirmedPasswordValid) {
      setIsAuthenticating(true);
      try {
        // save new user to Authentication Firebase
        const { authUserId } = await createUser(
          userData.email,
          userData.password
        );

        const newUserData = {
          authUserId: authUserId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          hasCompletedDogSetup: false,
        };

        // save new user to Realtime Database Firebase
        const newUserId = await storeUser(newUserData);
        authContext.authenticate(authUserId);
        authContext.setUser(newUserId);
      } catch (error) {
        console.log(error);

        Alert.alert(
          "Account Creation Failed",
          "We couldn't create your account. Please check your details and try again."
        );
        navigation.navigate("Signup");
        setIsAuthenticating(false);
        return;
      }
      setIsAuthenticating(false);

      navigation.navigate("DogRegistration");
    }
  }

  function validateFirstName() {
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    if (!userData.firstName) {
      setFirstNameError("First Name is required.");
      return false;
    } else if (!nameRegex.test(userData.firstName)) {
      setFirstNameError(
        "The names should contain only alphabetical characters."
      );
      return false;
    } else if (
      userData.firstName.length < 2 ||
      userData.firstName.length > 50
    ) {
      setFirstNameError("Names must be between 2 and 50 characters.");
      return false;
    }
    setFirstNameError("");
    return true;
  }

  function validateLastName() {
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    if (!userData.lastName) {
      setLastNameError("Last Name is required.");
      return false;
    } else if (!nameRegex.test(userData.lastName)) {
      setFirstNameError(
        "The names should contain only alphabetical characters."
      );
      return false;
    } else if (userData.lastName.length < 2 || userData.lastName.length > 50) {
      setLastNameError("Names must be between 2 and 50 characters.");
      return false;
    }
    setLastNameError("");
    return true;
  }

  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(userData.email)) {
      setEmailError("Enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword() {
    if (!userData.password) {
      setPasswordError("Password is required");
      return false;
    } else if (userData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  }

  function validateConfirmedPassword() {
    if (!userData.confirmedPassword) {
      setConfirmedPasswordError("Confirm password is required");
      return false;
    } else if (
      userData.confirmedPassword.length < 6 ||
      userData.confirmedPassword !== userData.password
    ) {
      setConfirmedPasswordError("Passwords do not match.");
      return false;
    }
    setPasswordError("");
    return true;
  }

  if (isAuthenticating) {
    return (
      <LoadSpinner
        visible={isAuthenticating}
        prompt="Creating your account..."
      />
    );
  }

  return (
    <View style={styles.safeAreaContainer}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Create Your Account</Text>
        <Text style={styles.subheadingText}>
          Kindly fill in the details below.
        </Text>
      </View>

      <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
        {currentFormContent === "userFullNameInputs"
          ? userNameFormContent
          : userEmailPasswordContent}
      </Animated.View>
    </View>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 28,
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
  },

  errorMessage: {
    fontFamily: "inter-regular",
    color: "#D00E17",
    fontSize: 12,
    lineHeight: 24,
    paddingHorizontal: 4,
    marginBottom: 12,
  },

  headingText: {
    fontFamily: "inter-semi-bold",
    fontSize: 24,
    textAlign: "center",
    color: "#191919",
    marginBottom: 8,
  },

  subheadingText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    textAlign: "center",
    color: "#737373",
  },

  userNameInputsContainer: {
    marginVertical: 32,
  },

  emailPasswordContainer: {
    marginTop: 32,
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
});
