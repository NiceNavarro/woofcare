import { View, Text, Image, StyleSheet } from "react-native";

function TabBarIcon({ focused, focusedIcon, unfocusedIcon, size }) {
  const icon = focused ? focusedIcon : unfocusedIcon;
  return <Image source={icon} style={{ width: size, height: 24 }} />;
}

export default TabBarIcon;

const styles = StyleSheet.create({});
