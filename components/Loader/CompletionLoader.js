import { View, StyleSheet } from "react-native";
import { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

import LottieView from "lottie-react-native";

function CompletionLoader() {
  const [playSecondAnimation, setPlaySecondAnimation] = useState(false);

  const progressAnimationRef = useRef(null);
  const checkAnimationRef = useRef(null);
  const navigation = useNavigation();

  const progressAnimation = require("../../assets/progress.json");
  const checkAnimation = require("../../assets/complete-check.json");

  function handleFirstAnimationFinish() {
    setPlaySecondAnimation(true);
  }

  function handleSecondAnimationFinish() {
    navigation.navigate("MainTabs");
  }
  return (
    <View style={styles.rootContainer}>
      {!playSecondAnimation ? (
        <LottieView
          ref={progressAnimationRef}
          source={progressAnimation}
          autoPlay
          loop={false}
          onAnimationFinish={handleFirstAnimationFinish}
          style={{
            width: 300,
            height: 300,
          }}
        />
      ) : (
        <LottieView
          ref={checkAnimationRef}
          source={checkAnimation}
          autoPlay
          loop={false}
          onAnimationFinish={handleSecondAnimationFinish}
          style={{ width: 80, height: 80 }}
        />
      )}
    </View>
  );
}

export default CompletionLoader;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F8F8F8",
  },
});
