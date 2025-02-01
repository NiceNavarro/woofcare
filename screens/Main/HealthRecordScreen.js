import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";

import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../../store/auth-context";
import { useFocusEffect } from "@react-navigation/native";

import VaccinationForm from "../../components/Form/VaccinationForm";

function HealthRecordScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const vaccineRecordLists = authContext.vaccines;
  const vetVisitRecordLists = authContext.vetVisitRecords;

  const [totalNextBoosterDue, setTotalNextBoosterDue] = useState(0);
  const [nearestNextBoosterDue, setNearestNextBoosterDue] = useState("None");

  const [vetLastVisit, setVetLastVisit] = useState("None");
  const [vetVisitReason, setVetVisitReason] = useState("None");
  const [vetVisitFollowUpDate, setVetVisitFollowUpDate] = useState("None");

  const [vaccinationFormVisible, setVaccinationFormVisible] = useState(false);

  function onAddVaccineRecord() {
    // setVaccinationFormVisible(true);
    navigation.navigate("VaccineRecord");
  }

  function closeModal() {
    setVaccinationFormVisible(false);
  }

  function getUpcomingBoosterDate() {
    const today = new Date();
    // console.log("Current Date Now:", today);

    const monthLookup = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const upcomingBoosters = vaccineRecordLists
      .filter((vaccine) => {
        const dateParts = vaccine.nextBoosterDate.split(" ");
        const [month, rawDay, year] = dateParts;

        // Clean up the day value (remove commas)
        const day = parseInt(rawDay.replace(",", ""));

        // Use the lookup to get the month index
        const monthIndex = monthLookup[month];

        if (monthIndex === undefined) {
          console.error("Invalid Month:", month);
          return false; // Skip invalid months
        }

        const boosterDate = new Date(year, monthIndex, day);

        // console.log("Date Parts:", dateParts);
        // console.log("Cleaned Day:", day);
        // console.log("Parsed Booster Date:", boosterDate);

        if (isNaN(boosterDate)) {
          console.error("Invalid Date:", vaccine.nextBoosterDate);
          return false; // Skip invalid dates
        }

        return boosterDate > today;
      })
      .map((vaccine) => ({
        nextBoosterDate: vaccine.nextBoosterDate,
      }));

    return upcomingBoosters;
  }

  function getNearestUpcomingBoosterDate() {
    const today = new Date();
    // console.log("Current Date Now:", today);

    const monthLookup = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const upcomingBoosters = vaccineRecordLists
      .filter((vaccine) => {
        const dateParts = vaccine.nextBoosterDate.split(" ");
        const [month, rawDay, year] = dateParts;

        // Clean up the day value (remove commas)
        const day = parseInt(rawDay.replace(",", ""));

        // Use the lookup to get the month index
        const monthIndex = monthLookup[month];

        if (monthIndex === undefined) {
          console.error("Invalid Month:", month);
          return false;
        }

        const boosterDate = new Date(year, monthIndex, day);

        if (isNaN(boosterDate)) {
          console.error("Invalid Date:", vaccine.nextBoosterDate);
          return false;
        }

        return boosterDate > today;
      })
      .map((vaccine) => {
        const dateParts = vaccine.nextBoosterDate.split(" ");
        const [month, rawDay, year] = dateParts;
        const day = parseInt(rawDay.replace(",", ""));
        const monthIndex = monthLookup[month];

        return {
          nextBoosterDate: vaccine.nextBoosterDate,
          parsedBoosterDate: new Date(year, monthIndex, day),
        };
      });

    // Sort by parsedBoosterDate
    const sortedBoosters = upcomingBoosters.sort(
      (a, b) => a.parsedBoosterDate - b.parsedBoosterDate
    );

    // Return the nearest upcoming booster date
    const nearestBooster = sortedBoosters[0] || null;

    console.log("Nearest Booster:", nearestBooster);
    return nearestBooster;
  }

  function getNearestVetVisitFollowUpDate() {
    const today = new Date();
    // console.log("Current Date Now:", today);

    const monthLookup = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const upcomingVisits = vetVisitRecordLists
      .filter((record) => {
        if (!record.followUpDateVisit) {
          console.error("Missing follow-up date:", record);
          return false;
        }

        const dateParts = record.followUpDateVisit.split(" "); // possible no date entry

        if (dateParts.length !== 3) {
          console.error("Invalid date format:", record.followUpDateVisit);
          return false;
        }

        const [month, rawDay, year] = dateParts;

        // Clean up the day value (remove commas)
        const day = parseInt(rawDay.replace(",", ""));

        // Use the lookup to get the month index
        const monthIndex = monthLookup[month];

        if (monthIndex === undefined) {
          console.error("Invalid Month:", month);
          return false;
        }

        const followUpDateVisit = new Date(year, monthIndex, day);

        if (isNaN(followUpDateVisit)) {
          console.error("Invalid Date:", record.followUpDateVisit);
          return false;
        }

        return followUpDateVisit > today;
      })
      .map((record) => {
        const dateParts = record.followUpDateVisit.split(" ");
        const [month, rawDay, year] = dateParts;
        const day = parseInt(rawDay.replace(",", ""));
        const monthIndex = monthLookup[month];

        return {
          dateOfVisit: record.dateOfVisit,
          reasonForVisit: record.reasonForVisit,
          followUpDateVisit: record.followUpDateVisit,
          parsedBoosterDate: new Date(year, monthIndex, day),
        };
      });

    // Sort by parsedBoosterDate
    const sortedFollowUpVisits = upcomingVisits.sort(
      (a, b) => a.parsedBoosterDate - b.parsedBoosterDate
    );

    // Return the nearest upcoming booster date
    const nearestFollowUpVisit = sortedFollowUpVisits[0] || null;

    console.log("Nearest Follow-Up Date Visit:", nearestFollowUpVisit);
    return nearestFollowUpVisit;
  }

  let vaccineCardContent;
  let vetVisitCardContent;

  useFocusEffect(
    useCallback(() => {
      // This runs when the screen is focused
      console.log("Focused");

      // This runs when the screen is unfocused
      return () => {
        setVetLastVisit("None");
        setVetVisitReason("None");
        setVetVisitFollowUpDate("None");
      };
    })
  );

  useEffect(() => {
    const upcomingBoosterRecords = getUpcomingBoosterDate();
    const nearestNextBoosterDue = getNearestUpcomingBoosterDate();
    const nearestVetVisitFollowUpDate = getNearestVetVisitFollowUpDate();

    if (upcomingBoosterRecords.length > 0) {
      setTotalNextBoosterDue(upcomingBoosterRecords.length);
      setNearestNextBoosterDue(nearestNextBoosterDue.nextBoosterDate);
    }

    if (nearestVetVisitFollowUpDate) {
      setVetLastVisit(nearestVetVisitFollowUpDate.dateOfVisit);
      setVetVisitReason(nearestVetVisitFollowUpDate.reasonForVisit);
      setVetVisitFollowUpDate(nearestVetVisitFollowUpDate.followUpDateVisit);
    } else {
    }
  }, [authContext.vaccines, authContext.vetVisitRecords]);

  if (vaccineRecordLists.length === 0) {
    vaccineCardContent = (
      <>
        <Text style={styles.vaccineHeading}>Vaccination Record</Text>
        <Text style={styles.vaccineSubheading}>
          No vaccination records yet.
        </Text>
        <Text style={styles.vaccineTip}>
          Tip: Record the vaccine name, date, and next due date to stay
          prepared.
        </Text>
        <TouchableOpacity
          onPress={onAddVaccineRecord}
          style={styles.addVaccineButton}
        >
          <Text style={styles.addVaccineButtonText}>Get Started</Text>
        </TouchableOpacity>
      </>
    );
  } else {
    vaccineCardContent = (
      <>
        <Text style={styles.vaccineHeading}>Vaccination Records</Text>
        <View style={styles.iconWithTextContainer}>
          <Image
            source={require("../../assets/syringe.png")}
            style={styles.icon}
          />
          <Text style={styles.vaccineSubheading}>
            Up-to-date: {vaccineRecordLists.length} vaccines
          </Text>
        </View>
        <View style={styles.iconWithTextContainer}>
          <Image
            style={styles.icon}
            source={require("../../assets/calendar.png")}
          />
          <Text style={styles.vaccineSubheading}>
            Upcoming: {totalNextBoosterDue} vaccines due
          </Text>
        </View>
        <View style={styles.iconWithTextContainer}>
          <Image
            style={styles.icon}
            source={require("../../assets/calendar.png")}
          />
          <Text style={styles.vaccineSubheading}>
            Next Due: {nearestNextBoosterDue}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addVaccineButton}
          onPress={() => navigation.navigate("VaccineRecord")}
        >
          <Text style={styles.addVaccineButtonText}>Tap to view or update</Text>
        </TouchableOpacity>
      </>
    );
  }

  if (vetVisitRecordLists.length === 0) {
    vetVisitCardContent = (
      <>
        <Text style={styles.vaccineHeading}>Vet Visit Record</Text>
        <Text style={styles.vaccineSubheading}>
          No vet visits recorded yet.
        </Text>
        <Text style={styles.vaccineTip}>
          Stay on track with your dog's health by regularly updating vet visits
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("VetVisitRecord");
          }}
          style={styles.addVaccineButton}
        >
          <Text style={styles.addVaccineButtonText}>Get Started</Text>
        </TouchableOpacity>
      </>
    );
  } else {
    vetVisitCardContent = (
      <>
        <Text style={styles.vaccineHeading}>Vet Visit Records</Text>
        <View style={styles.iconWithTextContainer}>
          <Image
            source={require("../../assets/calendar.png")}
            style={styles.icon}
          />
          <Text style={styles.vaccineSubheading}>
            Last Visit: {vetLastVisit}
          </Text>
        </View>
        <View style={styles.iconWithTextContainer}>
          <Image
            source={require("../../assets/syringe.png")}
            style={styles.icon}
          />
          <Text style={styles.vaccineSubheading}>Reason: {vetVisitReason}</Text>
        </View>
        <View style={styles.iconWithTextContainer}>
          <Image
            source={require("../../assets/calendar.png")}
            style={styles.icon}
          />
          <Text style={styles.vaccineSubheading}>
            Follow-Up Due: {vetVisitFollowUpDate}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addVaccineButton}
          onPress={() => navigation.navigate("VetVisitRecord")}
        >
          <Text style={styles.addVaccineButtonText}>Tap to view or update</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>{vaccineCardContent}</View>
      <View style={styles.cardContainer}>{vetVisitCardContent}</View>
      <VaccinationForm visible={vaccinationFormVisible} onClose={closeModal} />
    </View>
  );
}

export default HealthRecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    marginTop: 30,
  },

  cardContainer: {
    backgroundColor: "#F5F5F5",
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    borderRadius: 8,
    marginBottom: 30,
  },

  vaccineHeading: {
    fontFamily: "inter-bold",
    fontSize: 20,
    lineHeight: 30,
    color: "#333333",
    marginBottom: 24,
  },

  vaccineSubheading: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginBottom: 16,
  },

  addVaccineButton: {
    width: "100%",
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  addVaccineButtonText: {
    fontFamily: "inter-bold",
    textAlign: "center",
    fontSize: 16,
    color: "#FFFFFF",
  },

  vaccineTip: {
    fontFamily: "inter-regular",
    color: "#666666",
    lineHeight: 26,
    fontSize: 16,
    marginBottom: 16,
  },

  iconWithTextContainer: {
    flexDirection: "row",
  },

  icon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
});
