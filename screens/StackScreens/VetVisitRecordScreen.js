import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../store/auth-context";
import LottieView from "lottie-react-native";

import VetVisitForm from "../../components/Form/VetVisitForm";
import VetVisitRecordDetails from "../../components/ModalDetails/VetVisitRecordDetails";
import EditVetVisitForm from "../../components/Form/EditVetVisitForm";
import ItemActionModal from "../../components/Modal/ItemActionModal";
import LoadSpinner from "../../components/Modal/LoadSpinner";
import CustomModal from "../../components/Modal/CustomModal";
import SuccessAnimation from "../../components/Modal/SuccessAnimation";

import { getVetVisitRecordById } from "../../util/databaseFetch";
import { deleteVetVisitRecord } from "../../util/databaseDelete";

function VetVisitRecordScreen() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);

  const [isVetVisitFormVisible, setIsVetVisitFormVisible] = useState(false);
  const [isVetVisitDetailsVisible, setIsVetVisitDetailsVisible] =
    useState(false);
  const [isEditVetVisitFormVisible, setIsEditVetVisitFormVisible] =
    useState(false);
  const [isItemActionVisible, setIsItemActionVisible] = useState(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const [currentRecordIdSelected, setCurrentRecordIdSelected] = useState("");

  // for editing
  const [selectedVisitRecord, setSelectedVisitRecord] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  function openVetVisitForm() {
    setIsVetVisitFormVisible(true);
  }

  function closeVetVisitForm() {
    setIsVetVisitFormVisible(false);
  }

  async function openEditForm() {
    setIsFetching(true);
    try {
      console.log("Id Record Selected: ", currentRecordIdSelected);
      const record = await getVetVisitRecordById(currentRecordIdSelected);
      if (record) {
        setSelectedVisitRecord({
          recordId: currentRecordIdSelected,
          ...record,
        });
        setIsEditVetVisitFormVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  }

  function closeEditForm() {
    setIsItemActionVisible(false);
    setIsEditVetVisitFormVisible(false);
  }

  function openVetVisitDetailsModal(recordId) {
    setCurrentRecordIdSelected(recordId);
    setIsVetVisitDetailsVisible(true);
    console.log("Tapped id: ", recordId);
  }

  function closeVetvisitDetailsModal() {
    setIsVetVisitDetailsVisible(false);
  }

  function openItemActionModal(recordId) {
    setIsItemActionVisible(true);
    setCurrentRecordIdSelected(recordId);
  }

  function closeItemActionModal() {
    setIsItemActionVisible(false);
  }

  function openConfirmDeleteModal() {
    setIsConfirmDeleteVisible(true);
  }

  function closeConfirmDeleteModal() {
    setIsConfirmDeleteVisible(false);
    setIsItemActionVisible(false);
  }

  async function onConfirmDelete() {
    setIsFetching(true);
    try {
      await deleteVetVisitRecord(currentRecordIdSelected);
      const updatedVetVisitRecords = authContext.vetVisitRecords.filter(
        (record) => record.recordId !== currentRecordIdSelected
      );

      authContext.setVetVisitRecords(updatedVetVisitRecords, true);
      setCurrentRecordIdSelected("");
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
    setIsSuccessModalVisible(true);
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
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={openVetVisitForm} style={styles.addButton}>
          <Image
            style={styles.plusIcon}
            source={require("../../assets/plus-icon.png")}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  let content;

  if (authContext.vetVisitRecords.length === 0) {
    content = (
      <>
        <LottieView
          autoPlay
          style={styles.emptyDocsAnimation}
          source={require("../../assets/empty-documents.json")}
        />
        <Text style={styles.emptyText}>
          It looks like you haven't added any vet visit records yet.
        </Text>
        <TouchableOpacity
          style={styles.addVaccineButton}
          onPress={openVetVisitForm}
        >
          <Text style={styles.addVaccineButtonText}>Add Record</Text>
        </TouchableOpacity>
      </>
    );
  } else {
    content = (
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {authContext.vetVisitRecords.map((record) => (
          <TouchableOpacity
            key={record.recordId}
            onPress={() => openVetVisitDetailsModal(record.recordId)}
            style={styles.cardContainer}
            onLongPress={() => openItemActionModal(record.recordId)}
            delayLongPress={200}
          >
            <View style={styles.dogFaceContainer}>
              <LottieView
                style={styles.dogFace}
                autoPlay
                source={require("../../assets/dog-face.json")}
              />
            </View>
            <View>
              <Text style={styles.reasonForVisit}>{record.reasonForVisit}</Text>
              <Text style={styles.vetName}>Vet: {record.vetName}</Text>
              <Text style={styles.vetDateVisit}>
                Visit Date: {formatDateString(record.dateOfVisit)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {content}
      <VetVisitForm
        visible={isVetVisitFormVisible}
        onClose={closeVetVisitForm}
      />
      <EditVetVisitForm
        visible={isEditVetVisitFormVisible}
        visitRecord={selectedVisitRecord}
        onClose={closeEditForm}
      />
      <VetVisitRecordDetails
        visible={isVetVisitDetailsVisible}
        onClose={closeVetvisitDetailsModal}
        recordIdSelected={currentRecordIdSelected}
      />
      <ItemActionModal
        visible={isItemActionVisible}
        actionEdit={true}
        promptAction="Would you like to edit this record or delete it permanently?"
        onClose={closeItemActionModal}
        onEdit={openEditForm}
        onDelete={openConfirmDeleteModal}
      />
      <CustomModal
        title="Delete vaccine?"
        visible={isConfirmDeleteVisible}
        onClose={closeConfirmDeleteModal}
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
            setIsConfirmDeleteVisible(false);
            setIsItemActionVisible(false);
          }}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>No</Text>
        </TouchableOpacity>
      </CustomModal>
      <LoadSpinner visible={isFetching} prompt="Please wait..." />
      <SuccessAnimation
        visible={isSuccessModalVisible}
        successMessage="Record deleted successfully!"
        onClose={() => {
          setIsSuccessModalVisible(false);
          setIsConfirmDeleteVisible(false);
          setIsItemActionVisible(false);
        }}
      />
    </View>
  );
}

export default VetVisitRecordScreen;

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

  // card overview start
  cardContainer: {
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

  dogFaceContainer: {
    width: 75,
    height: 75,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: "100%",
    borderWidth: 1,
    borderColor: "#F9F9F9",
    marginRight: 16,
  },

  dogFace: {
    width: "100%",
    height: "100%",
  },

  reasonForVisit: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginBottom: 8,
  },
  vetName: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    marginBottom: 6,
  },

  vetDateVisit: {
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

  closeButtonText: {
    fontFamily: "inter-medium",
    textAlign: "center",
    color: "#333333",
    fontSize: 16,
  },

  buttonText: {
    fontFamily: "inter-medium",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
