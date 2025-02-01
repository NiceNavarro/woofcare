import { Text, TouchableOpacity, StyleSheet } from "react-native";

function Button({ children, onPress, size, customStyle }) {
  const buttonStyles = [
    styles.button,
    customStyle,
    size === "small" && styles.smallButton,
    size === "large" && styles.largeButton,
  ];
  const textStyles = [
    styles.text,
    size === "small" && styles.smallText,
    size === "large" && styles.largeText,
  ];
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles}>
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0275D8",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
    width: "200",
    height: 52,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 26,
  },
  largeText: {
    fontSize: 18,
  },
});
