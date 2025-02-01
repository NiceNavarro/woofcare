import {
  View,
  Platform,
  StatusBar,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from "react-native";

import { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import DogNameForm from "../../components/DogDetailsRegistration/DogNameForm";
import DogGenderForm from "../../components/DogDetailsRegistration/DogGenderForm";
import DogBirthdayForm from "../../components/DogDetailsRegistration/DogBirthdayForm";
import DogBreedForm from "../../components/DogDetailsRegistration/DogBreedForm";
import DogSterilizationFormContent from "../../components/DogDetailsRegistration/DogSterilizationFormContent";
import DogWeightForm from "../../components/DogDetailsRegistration/DogWeightForm";
import DogSetUpComplete from "../../components/DogDetailsRegistration/DogSetUpComplete";
import UnsavedProcess from "../../components/Modal/UnsavedProcess";

function DogRegistrationScreen({ route, navigation }) {
  const isFromAddProfile = route.params ? route.params.addNewProfile : false;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const defaultContent = "DogName";
  const [currentContent, setCurrentContent] = useState(defaultContent);

  const [dogProfile, setDogProfile] = useState({
    dogName: null,
    dogGender: null,
    dogBirthday: null,
    dogAge: null,
    dogBreed: null,
    dogWeight: null,
    neutered: null,
    spayed: null,
  });

  const [unsavedProcessModalVisible, setUnsavedProcessModalVisible] =
    useState(false);

  function onDogNameSubmit({ enteredDogName, nextFormContent }) {
    setDogProfile((previousProfileData) => ({
      ...previousProfileData,
      dogName: enteredDogName,
    }));
    setCurrentStep((previousStep) => previousStep + 1);
    slideContentAnimation({ direction: "next", nextContent: nextFormContent });
  }

  function onDogGenderSubmit({ selectedDogGender, nextFormContent }) {
    setDogProfile((previousProfileData) => ({
      ...previousProfileData,
      dogGender: selectedDogGender,
    }));
    setCurrentStep((previousStep) => previousStep + 1);
    slideContentAnimation({ direction: "next", nextContent: nextFormContent });
  }

  function onDogBirthdateSubmit({ dogBirthDate, nextFormContent }) {
    setDogProfile((previousProfileData) => ({
      ...previousProfileData,
      dogBirthday: dogBirthDate,
      dogAge: calculateDogAge(dogBirthDate),
    }));
    setCurrentStep((previousStep) => previousStep + 1);
    slideContentAnimation({
      direction: "next",
      nextContent: nextFormContent,
    });
  }

  function onDogBreedSubmit({ enteredDogBreed, nextFormContent }) {
    setDogProfile((previousProfileData) => ({
      ...previousProfileData,
      dogBreed: enteredDogBreed,
    }));

    setCurrentStep((previousStep) => previousStep + 1);

    slideContentAnimation({
      direction: "next",
      nextContent: nextFormContent,
    });
  }

  function onDogSterilizationOptionSubmit({
    selectedSterilizationOption,
    nextFormContent,
  }) {
    if (dogProfile.dogGender === "Male") {
      setDogProfile((previousProfileData) => ({
        ...previousProfileData,
        neutered: selectedSterilizationOption,
      }));
    } else if (dogProfile.dogGender === "Female") {
      setDogProfile((previousProfileData) => ({
        ...previousProfileData,
        spayed: selectedSterilizationOption,
      }));
    }

    setCurrentStep((previousStep) => previousStep + 1);

    slideContentAnimation({
      direction: "next",
      nextContent: nextFormContent,
    });
  }

  function onDogWeightSubmit({ enteredDogWeight, nextFormContent }) {
    setDogProfile((previousProfileData) => ({
      ...previousProfileData,
      dogWeight: enteredDogWeight,
    }));

    setCurrentStep((previousStep) => previousStep + 1);

    slideContentAnimation({
      direction: "next",
      nextContent: nextFormContent,
    });
  }

  function calculateDogAge(birthdate) {
    // Define months in order to convert month name to index
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Extract the month, day, and year from the birthdate string
    const [month, dayWithComma, year] = birthdate.split(" ");
    const day = parseInt(dayWithComma.replace(",", ""), 10);
    const monthIndex = monthNames.indexOf(month);

    if (monthIndex === -1 || isNaN(day) || isNaN(parseInt(year))) {
      throw new Error(
        "Invalid date format. Please use 'Month Day, Year' (e.g., 'November 21, 1995')."
      );
    }

    // Create a Date object using the parsed values
    const birthDate = new Date(year, monthIndex, day);
    const today = new Date();

    // Calculate the difference in years and months
    let years = today.getFullYear() - birthDate.getFullYear();
    let monthsDiff = today.getMonth() - birthDate.getMonth();

    // Adjust if the birthday hasn't occurred yet this year
    if (
      monthsDiff < 0 ||
      (monthsDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      years -= 1;
      monthsDiff += 12;
    }

    // Calculate the months difference if less than a year
    if (years === 0) {
      monthsDiff = (today.getMonth() - birthDate.getMonth() + 12) % 12;
      return monthsDiff > 0
        ? `${monthsDiff} months old`
        : "Less than a month old";
    }

    // Return result in "years old" or "months old" format
    return `${years} years old`;
  }

  function progressBarAnimation() {
    // Animate the width of the progress bar when currentStep changes
    Animated.timing(progressAnimation, {
      toValue: progress, // Target percentage
      duration: 500, // Animation duration (in ms)
      useNativeDriver: false,
    }).start();
  }

  function slideContentAnimation({ direction, nextContent, previousContent }) {
    const slideOutTo = direction === "next" ? -300 : 300;
    const slideInFrom = direction === "next" ? 300 : -300;

    Animated.timing(slideAnimation, {
      toValue: slideOutTo, // Slide current component out of the screen
      duration: 150,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCurrentContent(direction === "next" ? nextContent : previousContent); // Update the component after sliding out
      slideAnimation.setValue(slideInFrom); // Start the new component off-screen on the right

      // Slide the new component in from right to center
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 150,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }

  function handleGoBackButton({ previousFormContent }) {
    setCurrentStep((previousStep) => previousStep - 1);
    slideContentAnimation({
      direction: "back",
      previousContent: previousFormContent,
    });
  }

  function onHeaderBackPress() {
    setUnsavedProcessModalVisible(true);
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Optionally show an alert or just disable the back button
        Alert.alert(
          "Hold on!",
          "Are you sure you want to go back? Your progress will be lost.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Yes", onPress: () => navigation.navigate("AuthScreen") }, // Optional
          ],
          { cancelable: true }
        );

        // Return `true` to disable the back button
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Clean up the event listener when the screen loses focus
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    progressBarAnimation();
  }, [currentStep, dogProfile]);

  const progressBarWidth = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"], // Map 0-100 progress to 0%-100% width
  });

  const dogNameFormContent = <DogNameForm onSubmitForm={onDogNameSubmit} />;

  const dogGenderFormContent = (
    <DogGenderForm
      dogName={dogProfile.dogName}
      onSubmitForm={onDogGenderSubmit}
      onBack={handleGoBackButton}
    />
  );
  const dogBirthDateFormContent = (
    <DogBirthdayForm
      dogName={dogProfile.dogName}
      onSubmitForm={onDogBirthdateSubmit}
      onBack={handleGoBackButton}
    />
  );

  const dogBreedFormContent = (
    <DogBreedForm
      dogName={dogProfile.dogName}
      onSubmitForm={onDogBreedSubmit}
      onBack={handleGoBackButton}
    />
  );

  const dogSterilizationFormContent = (
    <DogSterilizationFormContent
      dogProfile={dogProfile}
      onSubmitForm={onDogSterilizationOptionSubmit}
      onBack={handleGoBackButton}
    />
  );
  const dogWeightFormContent = (
    <DogWeightForm
      dogName={dogProfile.dogName}
      onSubmitForm={onDogWeightSubmit}
      onBack={handleGoBackButton}
    />
  );

  const dogSetupComplete = <DogSetUpComplete dogProfile={dogProfile} />;

  return (
    <View style={styles.safeAreaContainer}>
      {isFromAddProfile ? (
        <TouchableOpacity onPress={onHeaderBackPress} style={{ marginTop: 24 }}>
          <Image
            source={require("../../assets/left-arrow.png")}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      ) : null}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBarInner, { width: progressBarWidth }]}
        />
      </View>

      <Animated.View
        style={{ flex: 1, transform: [{ translateX: slideAnimation }] }}
      >
        <View style={styles.contentContainer}>
          {currentContent === "DogName" ? dogNameFormContent : null}
          {currentContent === "DogGender" ? dogGenderFormContent : null}
          {currentContent === "DogBirthDay" ? dogBirthDateFormContent : null}
          {currentContent === "DogBreed" ? dogBreedFormContent : null}
          {currentContent === "DogSterilization"
            ? dogSterilizationFormContent
            : null}
          {currentContent === "DogWeight" ? dogWeightFormContent : null}
          {currentContent === "SetupComplete" ? dogSetupComplete : null}
        </View>
      </Animated.View>

      <UnsavedProcess
        visible={unsavedProcessModalVisible}
        onLeave={() => {
          setUnsavedProcessModalVisible(false);
          navigation.goBack();
        }}
        onClose={() => setUnsavedProcessModalVisible(false)}
      />
    </View>
  );
}

export default DogRegistrationScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 28,
    backgroundColor: "#F8F8FF",
  },

  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#A2D9FF",
    borderRadius: 5,
    marginTop: 24,
  },

  progressBarInner: {
    height: "100%",
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentHeading: {
    fontFamily: "inter-bold",
    fontSize: 24,
    textAlign: "center",
    color: "#333333",
    lineHeight: 40,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
