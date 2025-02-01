import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../store/auth-context";

import ItemActionModal from "./Modal/ItemActionModal";
import LoadSpinner from "./Modal/LoadSpinner";
import SuccessAnimation from "./Modal/SuccessAnimation";

import { deleteDiagnosisNote } from "../util/databaseDelete";

function DiagnoseReport({ selectedSymptom, data }) {
  const diagnoseResult = data.potential_diagnosis;
  const confidenceScore = data.confidence;
  const treatmentRecommendations = data?.recommendations?.treatments || [];
  const medication = data?.recommendations?.medications || [];
  const supplements = data?.recommendations?.supplements || [];
  const lifeStyleChanges = data?.recommendations?.lifestyle_changes || [];
  const vetVisit = data?.vet_visit_recommendation || null;
  const educationalInfo = data?.educational_information || [];

  console.log(JSON.stringify(data, null, 2));

  const authContext = useContext(AuthContext);
  const dogDetails = authContext.dogDetails;
  const diagnosisNotes = authContext.diagnosisNotes;

  if (!dogDetails) {
    return null;
  }

  const [currentNoteIdSelected, setCurrentNoteIdSelected] = useState("");
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [isSucessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  function handleNoteLongPress(notesData) {
    setIsActionModalVisible(true);
    setCurrentNoteIdSelected(notesData.noteId);
  }

  async function onConfirmDelete() {
    setIsFetching(true);
    try {
      await deleteDiagnosisNote(currentNoteIdSelected);
      const updatedDiagnosisNotes = authContext.diagnosisNotes.filter(
        (notes) => notes.noteId !== currentNoteIdSelected
      );
      authContext.setDiagnosisNotes(updatedDiagnosisNotes, true);
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  }

  if (isFetching) {
    return (
      <LoadSpinner
        visible={isFetching}
        prompt="Deleting note... Please wait."
      />
    );
  }

  return (
    <>
      <View style={styles.diagnoseResultContainer}>
        <Text style={styles.diagnosesTextHeading}>Diagnose Results</Text>
        <Text style={styles.dogTextDescription}>
          Dog's Name: {dogDetails.dogName}
        </Text>
        <Text style={styles.dogTextDescription}>
          Breed: {dogDetails.dogBreed}
        </Text>
        <Text style={styles.dogTextDescription}>Age: {dogDetails.dogAge}</Text>
        <Text style={styles.dogTextDescription}>
          Report Symptoms: {selectedSymptom}
        </Text>
      </View>

      <View style={styles.identifiedDiagnosisContainer}>
        <Text style={styles.diagnoseTextSubHeading}>Identified Diagnosis</Text>
        <Text style={styles.identifiedDiagnoseResult}>
          Result: {diagnoseResult}
        </Text>
        <Text style={styles.confidenceScoreLabel}>
          Confidence Score: {confidenceScore}
        </Text>
      </View>

      {treatmentRecommendations ? (
        <View style={styles.treatmentRecommendationContainer}>
          <Text style={styles.diagnoseTextSubHeading}>
            Treatment Recommendation
          </Text>
          {treatmentRecommendations.map((treatmentObj, index) => {
            return (
              <View key={index}>
                <Text style={styles.treatmentName}>
                  {index + 1}. {treatmentObj.description}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {medication ? (
        <View style={styles.medicationContainer}>
          <Text style={styles.diagnoseTextSubHeading}>Medication</Text>
          {medication.map((medicationObj, index) => {
            return (
              <View key={index}>
                <Text style={styles.medicationName}>{medicationObj.name}</Text>
                <Text style={styles.medicationDosage}>
                  Dosage: {medicationObj.dosage}
                </Text>
                <Text style={styles.medicationDuration}>
                  Duration: {medicationObj.duration}
                </Text>
                <Text style={styles.medicationNotes}>
                  Notes: {medicationObj.notes}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {supplements ? (
        <View style={styles.supplementContainer}>
          <Text style={styles.diagnoseTextSubHeading}>Supplements</Text>
          {supplements.map((supplementObj, index) => {
            return (
              <View key={index}>
                <Text style={styles.supplementName}>
                  Supplement: {supplementObj.name}
                </Text>
                <Text style={styles.supplementDosage}>
                  Dosage: {supplementObj.dosage}
                </Text>
                <Text style={styles.supplementNotes}>
                  Notes: {supplementObj.notes}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {lifeStyleChanges ? (
        <View style={styles.lifeStyleChangesContainer}>
          <Text style={styles.diagnoseTextSubHeading}>Lifestyle Changes</Text>
          {lifeStyleChanges.map((lifeStyle, index) => {
            return (
              <View key={index}>
                <Text style={styles.lifeStyleChanges}>
                  {index + 1}. {lifeStyle}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {vetVisit ? (
        <View style={styles.vetVisitContainer}>
          <Text style={styles.diagnoseTextSubHeading}>
            Vet Visit Recommendation
          </Text>
          <Text style={styles.vetVisitRecommended}>
            Recommendation: {vetVisit.recommended ? "Yes" : "No"}
          </Text>
          <Text style={styles.vetVisitUrgency}>
            Urgency: {vetVisit.urgency}
          </Text>
          <Text style={styles.vetVisitNote}>Notes: {vetVisit.notes}</Text>
        </View>
      ) : null}

      {educationalInfo ? (
        <View style={styles.educationalInfoContainer}>
          <Text style={styles.diagnoseTextSubHeading}>Educational</Text>
          {educationalInfo.map((educationalInfoObj, index) => {
            return (
              <View key={index} style={{ marginBottom: 28 }}>
                <Text style={styles.educationalInfoTitle}>
                  {educationalInfoObj.title}
                </Text>
                <Text style={styles.educationalInfoDescription}>
                  {educationalInfoObj.description}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {diagnosisNotes.length > 0 ? (
        <>
          <View style={styles.notesContainer}>
            <Text style={styles.additionalNotesHeading}>Additional Notes</Text>
            {diagnosisNotes.map((note) => (
              <TouchableOpacity
                key={note.noteId}
                delayLongPress={200}
                onLongPress={() => handleNoteLongPress(note)}
              >
                <Text style={styles.note}>• {note.note}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}
      <ItemActionModal
        visible={isActionModalVisible}
        actionEdit={true}
        promptAction="Would you like to edit this note or delete it permanently?"
        onClose={() => setIsActionModalVisible(false)}
        onDelete={onConfirmDelete}
      />
      <SuccessAnimation
        visible={isSucessModalVisible}
        onClose={() => {
          setIsSuccessModalVisible(false);
          setIsActionModalVisible(false);
        }}
        successMessage="Note deleted successfully!"
      />
    </>
  );
}

export default DiagnoseReport;

const styles = StyleSheet.create({
  diagnoseResultContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },

  identifiedDiagnosisContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },

  treatmentRecommendationContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },

  medicationContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },

  supplementContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },

  lifeStyleChangesContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },

  vetVisitContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },

  educationalInfoContainer: {
    // paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    // marginBottom: 32,
    // backgroundColor: "red",
  },

  diagnosesTextHeading: {
    fontFamily: "inter-bold",
    fontSize: 22,
    color: "#333333",
    marginTop: 16,
    marginBottom: 16,
  },

  diagnoseTextSubHeading: {
    fontFamily: "inter-bold",
    fontSize: 22,
    marginTop: 36,
    color: "#333333",
    marginBottom: 16,
  },

  dogTextDescription: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },

  identifiedDiagnoseResult: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
    lineHeight: 32,
  },

  confidenceScoreLabel: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#333333",
  },

  treatmentName: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
    lineHeight: 32,
  },

  treatmentDosage: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },

  treatmentDuration: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },

  treatmentNotes: {
    fontFamily: "inter-semi-bold",
    fontSize: 16,
    color: "#333333",
  },

  medicationName: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginVertical: 16,
  },

  medicationDosage: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
    lineHeight: 32,
  },

  medicationDuration: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
    lineHeight: 32,
  },

  medicationNotes: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
    lineHeight: 32,
  },

  supplementName: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },
  supplementDosage: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },
  supplementNotes: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
  },

  lifeStyleChanges: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
    lineHeight: 32,
  },

  vetVisitRecommended: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },

  vetVisitUrgency: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },

  vetVisitNote: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    lineHeight: 32,
  },

  educationalInfoTitle: {
    fontFamily: "inter-bold",
    fontSize: 18,
    color: "#333333",
    marginVertical: 24,
    lineHeight: 32,
  },

  educationalInfoDescription: {
    fontFamily: "inter-medium",
    fontSize: 16,
    color: "#333333",
    lineHeight: 32,
  },

  notesContainer: {
    marginVertical: 24,
  },

  additionalNotesHeading: {
    fontFamily: "inter-bold",
    fontSize: 22,
    color: "#333333",
    marginBottom: 16,
  },

  note: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 12,
  },
});
