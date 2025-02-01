import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

function DropdownComponent({
  options,
  placeholderText,
  onValueChange,
  customStyle,
  defaultValue = null,
}) {
  const [value, setValue] = useState(defaultValue);
  const [isFocus, setIsFocus] = useState(false);

  function handleChange(item) {
    if (value !== item.value) {
      setValue(item.value);
      onValueChange(item.value);
    }
    setIsFocus(false);
  }

  return (
    <View style={[styles.container, customStyle]}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#1E7ED4" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={options}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholderText : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleChange}
      />
    </View>
  );
}

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F5F6F8",
    justifyContent: "flex-start",
  },
  dropdown: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 10,
    paddingVertical: 4,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 10,
    color: "#7A7A7A",
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingLeft: 10,
    color: "#333333",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
