import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function ButtonTest({ title, onPress, size = "small" }) {
  const buttonStyles = [
    styles.button,
    size === "small" && styles.smallButton,
    size === "large" && styles.largeButton,
  ];
  const textStyles = [
    styles.text,
    size === "small" && styles.smallText,
    size === "large" && styles.largeText,
  ];
  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={buttonStyles}
        accessibilityLabel={title}
      >
        <Text style={textStyles}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ButtonTest;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007bff", // Primary color
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  smallButton: {
    width: 120,
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  smallText: {
    fontSize: 14,
  },
  largeButton: {
    width: 200,
    height: 52,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  largeText: {
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: "#b0b0b0",
  },
  disabledText: {
    color: "#e0e0e0",
  },
});
