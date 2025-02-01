import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../store/auth-context";
import LottieView from "lottie-react-native";

function VetVisitRecordDetails({ visible, onClose, recordIdSelected }) {
  const authContext = useContext(AuthContext);
  console.log("Fetched Auth Context: ", authContext.vetVisitRecords);
  let record;
  if (recordIdSelected) {
    record = authContext.vetVisitRecords.find(
      (record) => record.recordId === recordIdSelected
    );
    console.log("Record Fetched Results: ", record);
  } else {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <View style={styles.dogFaceContainer}>
              <LottieView
                style={styles.dogFace}
                source={require("../../assets/dog-face.json")}
                autoPlay
              />
            </View>
            <View style={styles.dogNameBreedContainer}>
              <Text style={styles.dogName}>Scobby</Text>
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.visitOverview}>
                <Text style={styles.groupTitle}>Visit Summary</Text>
                <Text style={styles.record}>
                  Date of Visit : {record.dateOfVisit}
                </Text>
                <Text style={styles.record}>
                  Reason for Visit: {record.reasonForVisit}
                </Text>
                <Text style={styles.record}>
                  Symptoms Noticed: {record.symptomsNoticed}
                </Text>
              </View>

              <View style={styles.syptomsAndDiagnosis}>
                <Text style={styles.groupTitle}>Diagnosis & Treatment</Text>

                <Text style={styles.record}>
                  Diagnosed Condition: {record.diagnosedCondition}
                </Text>
                <Text style={styles.record}>
                  Medication Prescribed: {record.medicationPrescribed}
                </Text>
                <Text style={styles.record}>
                  Treatment Done: {record.treatmentDone}
                </Text>
                <Text style={styles.record}>
                  Follow up Visit: {record.folloUpDateVisit}
                </Text>
              </View>

              <View style={styles.syptomsAndDiagnosis}>
                <Text style={styles.groupTitle}>Clinic Details</Text>
                <Text style={styles.record}>
                  Clinic Name: {record.clinicName}
                </Text>
                <Text style={styles.record}>
                  Clinic Address: {record.clinicAddress}
                </Text>
                <Text style={styles.record}>
                  Clinic Contact: {record.clinicContactNumber}
                </Text>
              </View>

              <View style={styles.syptomsAndDiagnosis}>
                <Text style={styles.groupTitle}>Veterinarian</Text>
                <Text style={styles.record}>Vet Name: {record.vetName}</Text>
                <Text style={styles.record}>
                  Notes from Vet: {record.notesFromVet}
                </Text>
              </View>

              <View style={styles.syptomsAndDiagnosis}>
                <Text style={styles.groupTitle}>Cost</Text>
                <Text style={styles.record}>
                  Vet Visit Cost: {record.vetVisitCost}
                </Text>
              </View>

              <View style={styles.syptomsAndDiagnosis}>
                <Text style={styles.groupTitle}>Personal Notes</Text>
                <Text style={styles.record}>Note: {record.personalNotes}</Text>
              </View>
            </ScrollView>
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default VetVisitRecordDetails;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    height: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  content: {
    flex: 1,
    padding: 20,
  },

  dogFaceContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: "100%",
    alignSelf: "center",
    marginBottom: 12,
  },

  dogFace: {
    width: "100%",
    height: "100%",
  },

  dogName: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },

  groupTitle: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginBottom: 12,
  },

  visitOverview: {
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    marginVertical: 24,
  },

  syptomsAndDiagnosis: {
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    marginBottom: 24,
  },

  record: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    lineHeight: 28,
    marginBottom: 8,
  },

  bottomButtonContainer: {
    marginVertical: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    width: "75%",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },

  closeButtonText: {
    fonfa: "inter-regular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});
