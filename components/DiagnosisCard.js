import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { RefreshControl } from "react-native-gesture-handler";

import { AuthContext } from "../store/auth-context";

function DiagnosisCard({
  data,
  timeStamp,
  observedSymptom,
  diagnosisResult,
  onLongPress,
}) {
  const authContext = useContext(AuthContext);
  const [isPressed, setIsPressed] = useState(false);
  const navigation = useNavigation();

  function handleOnPress() {
    navigation.navigate("DiagnoseDetails", { data: data });
  }

  function handleLongPress() {
    onLongPress();
  }

  return (
    <View style={styles.healthCheckContainer}>
      <Text style={styles.healthCheckTime}>{timeStamp}</Text>

      <TouchableOpacity
        onPress={handleOnPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onLongPress={handleLongPress}
        delayLongPress={200}
        style={[
          styles.healthCheckCard,
          isPressed ? styles.pressedShadow : styles.defaultShadow,
        ]}
      >
        <View style={styles.dogProfileContainer}>
          <View
            style={[
              styles.dogProfileImageHolder,
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
                source={require("../assets/dog-face.json")}
                style={styles.dogProfileAnimation}
                autoPlay
              />
            )}
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.symptomText}>Symptom: {observedSymptom}</Text>
          <Text style={styles.diagnosisText}>Diagnosis: {diagnosisResult}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default DiagnosisCard;

const styles = StyleSheet.create({
  healthCheckContainer: {
    marginVertical: 24,
  },

  healthCheckTime: {
    fontFamily: "inter-regular",
    color: "#7A7A7A",
    marginBottom: 16,
  },

  healthCheckCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  defaultShadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },

  // reduce shadow on press
  pressedShadow: {
    color: "red",
  },

  dogProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  dogProfileAnimation: {
    width: "100%",
    height: "100%",
  },

  detailsContainer: {
    flex: 2,
    justifyContent: "center",
  },

  dogProfileImageHolder: {
    width: 80,
    height: 80,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },

  dogImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 100,
  },

  symptomText: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#333333",
    marginBottom: 10,
    lineHeight: 28,
  },

  diagnosisText: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    lineHeight: 28,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});
