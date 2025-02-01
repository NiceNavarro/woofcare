import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import LottieView from "lottie-react-native";

import Button from "../UI/Button";

function CompleteAnimation({
  animationName,
  animationHeading,
  animationSubHeading,
  onViewResult,
  buttonText,
}) {
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  let filePathName;

  if (animationName === "complete-check") {
    filePathName = require("../../assets/complete-check.json");
  } else if (animationName === "complete-check2") {
    filePathName = require("../../assets/complete-check2.json");
  }

  function onAnimationFinish() {
    setIsButtonVisible(true);
  }

  function handleOnViewResult() {
    onViewResult();
  }
  return (
    <>
      <LottieView
        source={filePathName}
        autoPlay
        loop={false}
        onAnimationFinish={onAnimationFinish}
        style={styles.animation}
      />
      <Text style={styles.heading}>{animationHeading}</Text>
      <Text style={styles.text}>{animationSubHeading}</Text>
      {isButtonVisible && (
        <TouchableOpacity
          style={styles.viewResultButton}
          onPress={handleOnViewResult}
        >
          <Text style={styles.viewResultButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

export default CompleteAnimation;

const styles = StyleSheet.create({
  animation: {
    width: 120,
    height: 120,
  },
  heading: {
    fontFamily: "inter-bold",
    fontSize: 24,
    color: "#1E7ED4",
    marginBottom: 10,
  },

  text: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#1E7ED4",
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 24,
  },

  viewResultButton: {
    width: "80%",
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
  },
  viewResultButtonText: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
