import { Text, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { AuthContext } from "../../store/auth-context";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

import Button from "../UI/Button";
import Loading from "../Loader/Loading";

import { saveDogDetails } from "../../util/databasePost";
import { editUser } from "../../util/databasePatch";

function DogSetUpComplete({ dogProfile }) {
  const [isSavingData, setIsSavingData] = useState(false);
  const [dataSaveFinish, setDataSaveFinish] = useState(false);

  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  async function onCompleteSetup() {
    setIsSavingData(true);
    try {
      const dogData = {
        ...dogProfile,
        userId: authContext.currentUserId,
      };
      const dogId = await saveDogDetails(dogData);
      await editUser(authContext.currentUserId, { hasCompletedDogSetup: true });

      authContext.setDog(dogData);
      authContext.setDogId(dogId);
      authContext.setUser(authContext.currentUserId);

      authContext.setDiagnosis([]);
      authContext.setVaccines([]);
      authContext.setVetVisitRecords([]);
      authContext.setDiagnosisNotes([]);
    } catch (error) {
      console.log(error);
      setIsSavingData(false);
      setDataSaveFinish(false);
      return;
    }
    setIsSavingData(false);
    setDataSaveFinish(true);
    // navigation.navigate("MainTabs");
  }

  function onFinishAnimationComplete() {
    navigation.navigate("MainTabs");
  }

  if (isSavingData) {
    return <Loading text="Just a moment..." animation="spinner" />;
  }

  if (!isSavingData && dataSaveFinish) {
    return (
      <>
        <LottieView
          source={require("../../assets/complete-check.json")}
          autoPlay
          loop={false}
          onAnimationFinish={onFinishAnimationComplete}
          style={{ width: 100, height: 100 }}
        />
        <Text
          style={{
            fontFamily: "inter-semi-bold",
            fontSize: 16,
            color: "#1E7ED4",
          }}
        >
          Complete!
        </Text>
      </>
    );
  }

  return (
    <>
      <Text style={styles.contentHeading}>Great job!</Text>
      <Text style={styles.subHeading}>
        {dogProfile.dogName}'s profile is all set.
      </Text>
      <Text style={styles.regularText}>
        Notice changes in your dog's health? Share the symptoms, and WoofWise
        will provide personalized advice to help keep him feeling his best.
      </Text>

      <Button size="large" onPress={onCompleteSetup}>
        Complete Setup!
      </Button>

      <LottieView
        source={require("../../assets/confetti-animation.json")}
        autoPlay
        loop={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 500,
          height: 1000,
          transform: [{ translateX: -250 }, { translateY: -500 }],
          zIndex: -1,
        }}
      />
    </>
  );
}

export default DogSetUpComplete;

const styles = StyleSheet.create({
  contentHeading: {
    fontFamily: "inter-bold",
    fontSize: 28,
    textAlign: "center",
    color: "#333333",
    lineHeight: 40,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  subHeading: {
    fontFamily: "inter-medium",
    fontSize: 18,
    textAlign: "center",
    color: "#333333",
  },

  regularText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
    lineHeight: 26,
    marginTop: 24,
    marginBottom: 24,
  },
});
