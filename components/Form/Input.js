import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

function Input({
  onChangeText,
  value,
  hasError,
  placeholder,
  isPassword,
  inputMode,
  keyboardType,
  customStyle,
}) {
  const [isFocus, setIsFocus] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function onValueChange(newValue) {
    onChangeText(newValue);
  }

  function handleOnFocus() {
    setIsFocus(true);
  }

  function handleOnBlur() {
    setIsFocus(false);
  }

  function togglePasswordVisibility() {
    setIsPasswordVisible((prev) => !prev);
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.textInput,
          isFocus ? styles.focusedBorder : styles.defaultBorder,
          hasError && styles.errorBorder,
          customStyle,
        ]}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        placeholder={placeholder}
        placeholderTextColor={hasError ? "#D00E17" : "#555555"}
        onChangeText={onValueChange}
        value={value}
        secureTextEntry={isPassword && !isPasswordVisible}
        inputMode={inputMode}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={togglePasswordVisibility}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  textInput: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontFamily: "inter-regular",
    fontSize: 16,
    marginBottom: 22,
    borderWidth: 1,
  },

  focusedBorder: {
    borderWidth: 2,
    borderColor: "#0275D8",
  },

  defaultBorder: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },

  errorBorder: {
    borderWidth: 1,
    borderColor: "#D00E17",
  },

  iconContainer: {
    justifyContent: "center",
    height: "70%",
    position: "absolute",
    right: 16, // Aligns the icon to the right of the input
    // top: "50%", // Positions the icon vertically in the middle of the input field
    // transform: [{ translateY: -12 }], // Adjust the vertical alignment
    // backgroundColor: "red",
  },
});
