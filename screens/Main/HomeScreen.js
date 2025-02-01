import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import LottieView from "lottie-react-native";

import DiagnosisCard from "../../components/DiagnosisCard";
import CustomModal from "../../components/Modal/CustomModal";
import LoadSpinner from "../../components/Modal/LoadSpinner";
import ItemActionModal from "../../components/Modal/ItemActionModal";
import SuccessAnimation from "../../components/Modal/SuccessAnimation";

import { AuthContext } from "../../store/auth-context";

import {
  deleteDiagnoseData,
  deleteAllDiagnosisNote,
} from "../../util/databaseDelete";
import { RefreshControl } from "react-native-gesture-handler";

import AddNotesInput from "../../components/Form/AddNotesInput";

function HomeScreen({ navigation }) {
  const authContext = useContext(AuthContext);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isSpinnerModalVisible, setIsSpinnerModalVisible] = useState(false);
  const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] =
    useState(false);

  const [currentDiagnoseIdSelected, setCurrentDiagnoseIdSelected] =
    useState(null);

  const [isDeletingDiagnosis, setIsDeletingDiagnosis] = useState(false);
  const [isDiagnosisDeleted, setIsDiagnosisDeleted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isAddNoteFormVisible, setIsAddNoteFormVisible] = useState(false);

  function onclickDiagnoseNow() {
    navigation.navigate("Diagnose");
  }

  function openOptionsModal(data) {
    setCurrentDiagnoseIdSelected(data.diagnoseId);
    setIsOptionsModalVisible(true);
  }

  function closeOptionsModal() {
    setIsOptionsModalVisible(false);
  }

  function openConfirmModal() {
    setIsConfirmModalVisible(true);
  }

  function closeConfirmModal() {
    setIsConfirmModalVisible(false);
  }

  function openSpinnerModal() {
    setIsSpinnerModalVisible(true);
  }

  function closeSpinnerModal() {
    setIsSpinnerModalVisible(false);
  }

  function openDeleteSuccessfulModal() {
    setIsDeleteSuccessModalVisible(true);
  }

  function closeDeleteSuccessfulModal() {
    setIsDeleteSuccessModalVisible(false);
  }

  async function onDeleteDiagnosis() {
    setIsDeletingDiagnosis(true);
    setIsConfirmModalVisible(false);
    openSpinnerModal();
    try {
      // Perform deletion from the database
      await deleteDiagnoseData(currentDiagnoseIdSelected);
      await deleteAllDiagnosisNote(currentDiagnoseIdSelected);
      console.log("Diagnosis deleted from database successfully.");

      // Immediately update the context to reflect changes
      const updatedDiagnosis = authContext.diagnosis.filter(
        (diagnosis) => diagnosis.diagnoseId !== currentDiagnoseIdSelected
      );

      const updatedDiagnosisNotes = authContext.diagnosisNotes.filter(
        (diagnosisNote) =>
          diagnosisNote.diagnoseId !== currentDiagnoseIdSelected
      );

      authContext.setDiagnosis(updatedDiagnosis, true);
      authContext.setDiagnosisNotes(updatedDiagnosisNotes, true);

      //show success modal
      setIsDiagnosisDeleted(true);
      openDeleteSuccessfulModal(true);
    } catch (error) {
      console.error("Failed to delete diagnosis from database: ", error);
      setIsDeletingDiagnosis(false);
      setIsSpinnerModalVisible(false);
    }
    setIsDeletingDiagnosis(false);
    closeSpinnerModal();
  }

  function onRefresh() {
    setIsRefreshing(true);

    // Simulate data fetch or revalidation
    setTimeout(() => {
      // Reset refreshing state
      setIsRefreshing(false);
    }, 1000);
  }

  useEffect(() => {
    function onBackPress() {
      Alert.alert(
        "Exit App",
        "Do you want to exit?",
        [
          {
            text: "Cancel",
            onPress: () => {
              // Do nothing
            },
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );

      return true;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, []);

  let content;
  let customModalContent;

  console.log(authContext.dogDetails);

  if (!authContext.dogDetails) {
    return null;
  }

  if (authContext.diagnosis.length > 0) {
    content = (
      <ScrollView
        style={styles.rootContainer}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.textHeading}>
          Let's make sure {authContext.dogDetails.dogName} is feeling well
          today.
        </Text>
        <View style={styles.lastSevenDaysContainer}>
          <Text style={styles.lastSevenDaysText}>
            Recent Health Check (Last 7 Days)
          </Text>

          {authContext.diagnosis.map((data, index) => (
            <View key={data.diagnoseId}>
              <DiagnosisCard
                data={data}
                timeStamp={data.timeStamp}
                observedSymptom={data.observedSymptom}
                diagnosisResult={data.potential_diagnosis}
                onLongPress={() => openOptionsModal(data)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  } else {
    content = (
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/dog-pet-lottie.json")}
          autoPlay
          style={{
            width: 250,
            height: 250,
          }}
        />

        <Text style={styles.noDiagnoseText}>
          It looks like {authContext.dogDetails.dogName} is doing great! Let's
          check up on him just to be sure.
        </Text>

        <TouchableOpacity
          style={styles.startDiagnoseButton}
          onPress={onclickDiagnoseNow}
        >
          <Text style={styles.startDiagnoseText}>Start Diagnose</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isDiagnosisDeleted) {
    customModalContent = (
      <>
        <Text style={styles.deleteTextBody}>
          Are you sure you want to delete this diagnosis for your dog? This
          action cannot be undone.
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDeleteDiagnosis}
        >
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={closeConfirmModal}
        >
          <Text style={styles.closeButtonText}>No</Text>
        </TouchableOpacity>
      </>
    );
  }

  if (isDeletingDiagnosis) {
    customModalContent = (
      <LoadSpinner
        visible={isSpinnerModalVisible}
        prompt="Deleting data, please wait..."
      />
    );
  }

  return (
    <>
      {content}

      <ItemActionModal
        promptAction="Would you like to add notes to this diagnose results or delete it permanently?"
        visible={isOptionsModalVisible}
        onClose={closeOptionsModal}
        actionEdit={false}
        onAddNote={() => setIsAddNoteFormVisible(true)}
        onDelete={openConfirmModal}
      />

      <CustomModal
        visible={isConfirmModalVisible}
        title={isDiagnosisDeleted ? "Successful!" : "Delete Diagnosis?"}
        onClose={closeConfirmModal}
        titleColor={isDiagnosisDeleted ? "#007BFF" : "#333333"}
      >
        {customModalContent}
      </CustomModal>

      <SuccessAnimation
        visible={isDeleteSuccessModalVisible}
        onClose={() => {
          closeConfirmModal();
          closeOptionsModal();
          closeDeleteSuccessfulModal();
          setIsDiagnosisDeleted(false);
        }}
        successMessage="Diagnose data deleted successfully!"
      />

      <AddNotesInput
        visible={isAddNoteFormVisible}
        onClose={() => {
          setIsOptionsModalVisible(false);
          setIsAddNoteFormVisible(false);
        }}
        selectedDiagnosisId={currentDiagnoseIdSelected}
      />
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  illustrationContainer: {
    width: 300,
    height: 300,
    backgroundColor: "#333333",
  },

  illustrationImage: {
    width: "100%",
    height: "100%",
  },
  noDiagnoseText: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#7A7A7A",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 32,
    lineHeight: 28,
  },

  rootContainer: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },

  textHeading: {
    fontFamily: "inter-bold",
    fontSize: 24,
    lineHeight: 36,
    color: "#333333",
    marginTop: 70,
  },

  lastSevenDaysContainer: {
    marginTop: 50,
  },

  lastSevenDaysText: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
  },

  healthCheckContainer: {
    marginVertical: 24,
  },

  healthCheckTime: {
    fontFamily: "inter-regular",
    color: "#7A7A7A",
    marginBottom: 16,
  },

  healthCheckCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },

  dogProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  detailsContainer: {
    flex: 2,
    justifyContent: "center",
  },

  dogProfileImageHolder: {
    width: 80,
    height: 80,
    borderRadius: 100,
    overflow: "hidden",
    padding: 4,
    borderWidth: 2,
    borderColor: "#1E7ED4",
  },
  dogProfileAnimationContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#F5F5F5",
    padding: 20,
    marginBottom: 24,
    borderRadius: 50,
    // borderWidth: 3,
    // borderColor: "#1E7ED4",
  },

  dogProfileAnimation: {
    width: "100%",
    height: "100%",
  },
  symptomText: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#333333",
    marginBottom: 10,
    lineHeight: 28,
  },

  diagnosisText: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    lineHeight: 28,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  optionsContainer: {
    width: "80%",
    padding: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
  },

  deleteButton: {
    width: "100%",
    backgroundColor: "#ff4d4f",
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 12,
  },

  noteButton: {
    width: "100%",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 16,
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

  deleteTextBody: {
    fontFamily: "inter-regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
    marginBottom: 24,
  },

  deleteTextSuccess: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#007BFF",
    marginBottom: 16,
  },

  startDiagnoseButton: {
    width: "80%",
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
  },
  startDiagnoseText: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
