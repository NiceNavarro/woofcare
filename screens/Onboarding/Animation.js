import React, { useState, useRef } from "react";
import { View, Text, Button, Animated, Easing, StyleSheet } from "react-native";

function Animation() {
  // Animation value for slide
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [currentComponent, setCurrentComponent] = useState(
    <View style={styles.box}>
      <Text style={styles.text}>Hello, this is the first component.</Text>
    </View>
  );

  const nextComponent = (
    <View style={styles.box}>
      <Text style={styles.text}>
        This is the new component after sliding in.
      </Text>
    </View>
  );

  // Function to trigger slide-in animation
  const slideInText = () => {
    // Animate to slide out current component to the left
    Animated.timing(slideAnim, {
      toValue: -300, // Slide current component out of the screen
      duration: 150,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCurrentComponent(nextComponent); // Update the component after sliding out
      slideAnim.setValue(300); // Start the new component off-screen on the right

      // Slide the new component in from right to center
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {currentComponent} {/* Render the current component */}
      </Animated.View>
      <Button title="Slide Component" onPress={slideInText} />
    </View>
  );
}

export default Animation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedContainer: {
    width: 300,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
  },
});
