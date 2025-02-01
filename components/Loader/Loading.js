import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

function Loading({ text, animation }) {
  let animationFilePath;
  let animationStyle;

  if (animation === "paw") {
    animationFilePath = require("../../assets/paw.json");
    animationStyle = { width: 100, height: 100 };
  } else if (animation === "heart-pulse") {
    animationFilePath = require("../../assets/heart-pulse.json");
    animationStyle = { width: 120, height: 120 };
  } else if (animation === "spinner") {
    animationFilePath = require("../../assets/spinner-blue.json");
    animationStyle = { width: 70, height: 70, marginBottom: 16 };
  } else if (animation === "pulse") {
    animationFilePath = require("../../assets/pulse.json");
    animationStyle = { width: 170, height: 170 };
  }

  return (
    <View style={styles.rootContainer}>
      <LottieView source={animationFilePath} autoPlay style={animationStyle} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

export default Loading;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F8F8F8",
  },

  spinner: {
    marginBottom: 20,
  },
  text: {
    fontFamily: "inter-medium",
    fontSize: 16,
    marginBottom: 12,
    color: "#0275D8",
    textAlign: "center",
    lineHeight: 24,
  },
});
