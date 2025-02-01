import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

import { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

function DatePickerUI({ onPress, textLabel, customStyle, placeholder }) {
  const [date, setDate] = useState(new Date());
  const currentDate = getFormattedDate(date);

  function getFormattedDate(date) {
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formattedDate;
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    const newDateSelected = getFormattedDate(currentDate);
    onPress(newDateSelected);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <View style={styles.datepickContainer}>
      <Text style={styles.pickDateText}>{textLabel}</Text>
      <TouchableOpacity
        onPress={showDatepicker}
        style={[styles.datepickerButton, customStyle]}
      >
        <Image
          style={styles.calendarIcon}
          source={require("../../assets/calendar.png")}
        />
        <Text style={styles.dateText}>
          {placeholder === undefined ? currentDate : placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default DatePickerUI;

const styles = StyleSheet.create({
  datepickContainer: {
    marginBottom: 32,
  },
  datepickerButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  pickDateText: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },

  dateText: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },

  calendarIcon: {
    width: 25,
    height: 25,
  },
});
