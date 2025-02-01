import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import LottieView from "lottie-react-native";

import { AuthContext } from "../../store/auth-context";
import VaccinationForm from "../../components/Form/VaccinationForm";
import ItemActionModal from "../../components/Modal/ItemActionModal";
import SuccessAnimation from "../../components/Modal/SuccessAnimation";
import LoadSpinner from "../../components/Modal/LoadSpinner";
import CustomModal from "../../components/Modal/CustomModal";
import EditVaccineForm from "../../components/Form/EditVaccineForm";
import VaccinRecordDetails from "../../components/ModalDetails/VaccinRecordDetails";

import { deleteVaccine } from "../../util/databaseDelete";
import { getVaccineById } from "../../util/databaseFetch";

function VaccineRecordScreen({}) {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const vaccines = authContext.vaccines;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [vaccinationFormVisible, setVaccinationFormVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [currentVaccineIdSelected, setCurrentVaccineIdSelected] = useState("");
  const [confirmDeleteModalVisible, setConfirmDeleteModalVibsile] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [vaccineSavedRecord, setVaccineSavedRecord] = useState(null);
  const [vaccinRecordDetailsVisible, setVaccineRecordDetailsVisible] =
    useState(false);

  function onAddButtonPress() {
    setVaccinationFormVisible(true);
  }

  function closeVaccinationForm() {
    setVaccinationFormVisible(false);
  }

  function onCloseActionModal() {
    setActionModalVisible(false);
    setCurrentVaccineIdSelected("");
  }

  function onCloseConfirmDeleteModal() {
    setConfirmDeleteModalVibsile(false);
  }

  function handleOnLongPress(vaccine) {
    setActionModalVisible(true);
    setCurrentVaccineIdSelected(vaccine.vaccineId);
  }

  async function onConfirmDelete() {
    setIsDeleting(true);
    try {
      await deleteVaccine(currentVaccineIdSelected);
      const updatedVaccineRecords = authContext.vaccines.filter(
        (vaccine) => vaccine.vaccineId !== currentVaccineIdSelected
      );

      authContext.setVaccines(updatedVaccineRecords, true);
      setCurrentVaccineIdSelected("");
    } catch (error) {
      console.log("error");
    }
    setIsDeleting(false);
    setSuccessModalVisible(true);
  }

  async function onEditVaccine() {
    setActionModalVisible(false);
    setIsFetching(true);
    try {
      const response = await getVaccineById(currentVaccineIdSelected);

      if (response) {
        setVaccineSavedRecord({
          vaccineId: currentVaccineIdSelected,
          ...response,
        });
        setEditFormVisible(true);
      } else {
        console.log("No vaccine data found.");
      }
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  }

  function onRefresh() {
    setIsRefreshing(true);

    // Simulate data fetch or revalidation
    setTimeout(() => {
      // Reset refreshing state
      setIsRefreshing(false);
    }, 1000);
  }

  function formatDateString(date) {
    const months = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    const [monthName, day, year] = date.replace(",", "").split(" ");

    // Convert the month name to its numerical representation
    const month = months[monthName];

    // Format the day to always be two digits
    const formattedDay = day.padStart(2, "0");

    // Return the formatted date
    return `${month}/${formattedDay}/${year}`;
  }

  function onVaccineCardPress(vaccineId) {
    setCurrentVaccineIdSelected(vaccineId);
    setVaccineRecordDetailsVisible(true);
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onAddButtonPress} style={styles.addButton}>
          <Image
            style={styles.plusIcon}
            source={require("../../assets/plus-icon.png")}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (isDeleting) {
    return (
      <LoadSpinner
        visible={isDeleting}
        prompt="Deleting data.... Please wait."
      />
    );
  }

  if (isFetching) {
    return <LoadSpinner visible={isFetching} prompt="Please wait..." />;
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {vaccines.length > 0 ? (
          vaccines.map((vaccine) => (
            <TouchableOpacity
              key={vaccine.vaccineId}
              style={styles.vaccineCardContainer}
              delayLongPress={200}
              onLongPress={() => handleOnLongPress(vaccine)}
              onPress={() => onVaccineCardPress(vaccine.vaccineId)}
            >
              <View style={styles.dogFaceAnimationContainer}>
                <LottieView
                  style={styles.dogFaceAnimation}
                  autoPlay
                  source={require("../../assets/dog-face.json")}
                />
              </View>

              <View style={styles.vaccineContentContainer}>
                <Text style={styles.vaccineName}>
                  Vaccine: {vaccine.vaccine}
                </Text>

                <Text style={styles.nextBoosterDate}>
                  Next Booster: {formatDateString(vaccine.nextBoosterDate)}
                </Text>
                <Text style={styles.vaccineAdministered}>
                  Administered: {formatDateString(vaccine.dateAdministered)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <>
            <LottieView
              autoPlay
              style={styles.emptyDocsAnimation}
              source={require("../../assets/empty-documents.json")}
            />
            <Text style={styles.emptyText}>
              It looks like you haven't added any vaccine records yet. You can
              add your dog's vaccine details to keep track of their health!
            </Text>
            <TouchableOpacity
              style={styles.addVaccineButton}
              onPress={() => setVaccinationFormVisible(true)}
            >
              <Text style={styles.addVaccineButtonText}>Add Vaccine</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <VaccinationForm
        visible={vaccinationFormVisible}
        onClose={closeVaccinationForm}
      />
      <ItemActionModal
        visible={actionModalVisible}
        actionEdit={true}
        onEdit={onEditVaccine}
        onClose={onCloseActionModal}
        onDelete={() => setConfirmDeleteModalVibsile(true)}
        promptAction="Would you like to edit this vaccine data or delete it permanently?"
      />

      <CustomModal
        title="Delete vaccine?"
        visible={confirmDeleteModalVisible}
        onClose={onCloseConfirmDeleteModal}
      >
        <Text style={styles.deleteTextBody}>
          Are you sure you want to delete this diagnosis for your dog? This
          action cannot be undone.
        </Text>
        <TouchableOpacity onPress={onConfirmDelete} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setConfirmDeleteModalVibsile(false);
            setActionModalVisible(false);
          }}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>No</Text>
        </TouchableOpacity>
      </CustomModal>
      <SuccessAnimation
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          setConfirmDeleteModalVibsile(false);
          setActionModalVisible(false);
        }}
        successMessage="Vaccine data deleted successfully!"
      />
      <EditVaccineForm
        visible={editFormVisible}
        onClose={() => {
          setEditFormVisible(false);
        }}
        vaccineRecord={vaccineSavedRecord}
      />

      <VaccinRecordDetails
        visible={vaccinRecordDetailsVisible}
        onClose={() => setVaccineRecordDetailsVisible(false)}
        vaccineIdSelected={currentVaccineIdSelected}
      />
    </View>
  );
}

export default VaccineRecordScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 18,
  },

  scrollView: {
    flex: 1,
  },

  addButton: {
    marginRight: 16,
  },

  plusIcon: {
    width: 30,
    height: 30,
  },

  vaccineCardContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 16,
  },

  vaccineContentContainer: {
    flex: 1,
    flexShrink: 1,
  },

  dogFaceAnimationContainer: {
    width: 75,
    height: 75,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: "100%",
    borderWidth: 1,
    borderColor: "#F9F9F9",
    marginRight: 16,
  },

  dogFaceAnimation: {
    width: "100%",
    height: "100%",
  },

  dogName: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#333333",
    marginBottom: 4,
  },

  vaccineName: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginBottom: 8,
  },

  nextBoosterDate: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    marginBottom: 6,
  },
  vaccineAdministered: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    marginBottom: 6,
  },

  deleteTextBody: {
    fontFamily: "inter-regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
    marginBottom: 24,
  },

  deleteButton: {
    width: "100%",
    backgroundColor: "#ff4d4f",
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 12,
  },

  closeButton: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    borderRadius: 6,
  },

  buttonText: {
    fontFamily: "inter-medium",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
  },

  closeButtonText: {
    fontFamily: "inter-medium",
    textAlign: "center",
    color: "#333333",
    fontSize: 16,
  },

  emptyDocsAnimation: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 24,
  },

  emptyText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    lineHeight: 28,
    textAlign: "center",
  },

  addVaccineButton: {
    width: "50%",
    backgroundColor: "#007BFF",
    alignSelf: "center",
    marginTop: 24,
    padding: 14,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },

  addVaccineButtonText: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#F5F5F5",
    textAlign: "center",
  },
});
