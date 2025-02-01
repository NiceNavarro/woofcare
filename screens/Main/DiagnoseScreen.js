import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { useState, useContext, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import DiagnoseReport from "../../components/DiagnoseReport";
import DropdownComponent from "../../components/UI/Dropdown";
import LoadSpinner from "../../components/Modal/LoadSpinner";
import CompleteAnimation from "../../components/Loader/CompleteAnimation";
import DiagnoseInProgressModal from "../../components/Modal/DiagnoseInProgressModal";

import { diagnosticPrompt } from "../../api/prompt";
import { generateStructuredOutput } from "../../api/model";
import { commonSymptoms } from "../../data/symptoms";
import { getFormattedDateTime } from "../../util/datetime";
import { useFocusEffect } from "@react-navigation/native";

import { AuthContext } from "../../store/auth-context";
import { saveDogDiagnosis } from "../../util/databasePost";

function DiagnoseScreen() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const dogDetails = authContext.dogDetails;

  if (!authContext.dogDetails) {
    return null;
  }

  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [history, setHistory] = useState([
    { role: "system", content: diagnosticPrompt },
  ]);

  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [buttonVisible, setButtonVisible] = useState(false);
  const [symptomSubmitted, setSymptomSubmitted] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [isSavingResults, setIsSavingResults] = useState(false);
  const [isResultSaved, setIsResultSaved] = useState(false);

  const [diagnoseComplete, setDiagnoseComplete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

  const [specificSignInpuVisible, setSpecificSignInputVisible] =
    useState(false);

  let spayedOrNeuteredStatus;

  if (dogDetails) {
    spayedOrNeuteredStatus =
      dogDetails.dogGender === "Male"
        ? `Neutered: ${dogDetails.neutered}`
        : `Spayed: ${dogDetails.spayed}`;
  }

  function handleSymptomChange(value) {
    setSelectedSymptom(value);
    setPrompt(
      `The user has observed the following symptom in their dog: ${value}. Here are the dog's profile. Age: ${dogDetails.dogAge}, Breed: ${dogDetails.dogBreed}, Gender: ${dogDetails.dogGender}, ${spayedOrNeuteredStatus}, Weight: ${dogDetails.dogWeight}kg`
    );
    setButtonVisible(true);
  }

  function handleSpecificSignChange(value) {
    setSelectedSymptom(value);
    setPrompt(
      `The user has observed the following symptom in their dog: ${value}. Here are the dog's profile. Age: ${dogDetails.dogAge}, Breed: ${dogDetails.dogBreed}, Gender: ${dogDetails.dogGender}, ${spayedOrNeuteredStatus}, Weight: ${dogDetails.dogWeight}kg`
    );
    setButtonVisible(true);
  }

  function handleAnswerChange(followUpQuestion, value) {
    setAnswers((previousAnswer) => {
      return {
        ...previousAnswer,
        [followUpQuestion]: value,
      };
    });
  }

  async function handleOnSubmitClick() {
    if (symptomSubmitted) {
      return;
    }

    setSymptomSubmitted(true);
    setIsFetching(true);
    setButtonVisible(false);

    const newMessage = { role: "user", content: prompt };

    // Add user message to the history
    const updatedHistory = [...history, newMessage];

    try {
      // Get AI Response
      const responseResult = await generateStructuredOutput(updatedHistory);

      // Ensure responseResult is an object and not a string
      if (typeof responseResult === "object") {
        // Add AI response to the history as string
        const aiResponse = {
          role: "assistant",
          content: JSON.stringify(responseResult),
        };

        // Update history and state
        setHistory([...updatedHistory, aiResponse]);
        setAiResponse(responseResult);
        setPrompt("");

        const followUpQuestions = responseResult.follow_up_questions.map(
          (obj) => {
            let answers = obj.answers;

            // Ensure answers for 'yes_no' type questions
            if (
              obj.expected_answer_type === "yes_no" &&
              obj.answers.length === 0
            ) {
              answers = [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ];
            } else {
              // Otherwise, map the existing answers
              answers = obj.answers.map((answerOption) => ({
                label: answerOption,
                value: answerOption,
              }));
            }

            return {
              question: obj.question,
              answer_type: obj.expected_answer_type,
              answers: answers,
            };
          }
        );
        setFollowUpQuestions(followUpQuestions);
      } else {
        console.error("Expected object but got:", responseResult);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  }

  async function handleOnContinue() {
    let newPrompt = "";
    for (const [key, value] of Object.entries(answers)) {
      newPrompt += `- ${key}: ${value}\n`;
    }
    setPrompt(newPrompt);

    const newMessage = { role: "user", content: newPrompt };
    const updatedHistory = [...history, newMessage];

    setIsFetching(true);

    try {
      const responseResult = await generateStructuredOutput(updatedHistory);

      const aiResponse = {
        role: "assistant",
        content: JSON.stringify(responseResult),
      };
      setHistory([...updatedHistory, aiResponse]);
      setAiResponse(responseResult);

      setAnswers([]);
      setFollowUpQuestions([]);

      // Ensure follow-up questions are properly handled
      const followUpQuestions = responseResult.follow_up_questions.map(
        (obj) => {
          let answers = obj.answers;

          if (
            obj.expected_answer_type === "yes_no" &&
            obj.answers.length === 0
          ) {
            answers = [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ];
          } else {
            answers = obj.answers.map((answerOption) => ({
              label: answerOption,
              value: answerOption,
            }));
          }

          return {
            question: obj.question,
            answer_type: obj.expected_answer_type,
            answers: answers,
          };
        }
      );

      setFollowUpQuestions(followUpQuestions);

      if (responseResult.diagnosis_phase.is_final) {
        setDiagnoseComplete(true);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error during API call: ", error);
    } finally {
      setIsFetching(false);
    }
  }

  async function handleOnSaveDiagnosis() {
    setIsSavingResults(true);
    openSpinnerModal();

    try {
      const finalResultData = {
        ...aiResponse,
        observedSymptom: selectedSymptom,
        dogId: authContext.currentDogId,
        userId: authContext.currentUserId,
        timeStamp: getFormattedDateTime(),
      };

      const diagnoseId = await saveDogDiagnosis(finalResultData);

      const newDiagnoseData = [{ diagnoseId: diagnoseId, ...finalResultData }];

      authContext.setDiagnosis(newDiagnoseData);

      // Mark the result as saved before proceeding
      setIsResultSaved(true);

      // Reset state for a new diagnosis session
      setSelectedSymptom("");
      setPrompt("");
      setAiResponse(null);
      setHistory([{ role: "system", content: diagnosticPrompt }]);
      setFollowUpQuestions([]);
      setAnswers({});
      setButtonVisible(false);
      setSymptomSubmitted(false);
      setDiagnoseComplete(false);
      setIsModalVisible(true);
      setIsSpinnerVisible(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSavingResults(false);
      setIsSpinnerVisible(false);
    }
  }

  function handleModalClose() {
    if (isResultSaved) {
      // Reset modal state before navigating
      setIsModalVisible(false);
      setIsResultSaved(false);

      navigation.navigate("HomeStack");
    } else {
      setIsModalVisible(false);
    }
  }

  function openSpinnerModal() {
    setIsSpinnerVisible(true);
  }

  function closeSpinnerModal() {
    setIsSpinnerVisible(false);
  }

  useFocusEffect(
    useCallback(() => {
      // Reset all state variables when the screen gains focus
      setSelectedSymptom("");
      setPrompt("");
      setAiResponse(null);
      setHistory([{ role: "system", content: diagnosticPrompt }]);
      setFollowUpQuestions([]);
      setAnswers({});
      setButtonVisible(false);
      setSymptomSubmitted(false);
      setDiagnoseComplete(false);
      setIsModalVisible(false);
      setIsResultSaved(false);
      setSpecificSignInputVisible(false);
    }, [])
  );

  if (isFetching) {
    return <DiagnoseInProgressModal isVisible={isFetching} />;
  }

  if (isSavingResults) {
    return (
      <LoadSpinner
        visible={isSpinnerVisible}
        prompt={"Saving results, please wait..."}
      />
    );
  }

  let content = (
    <View style={{ width: "100%" }}>
      {selectedSymptom ? (
        <Text style={styles.textHeading}>Let's See What's Going On!</Text>
      ) : (
        <Text style={styles.textHeading}>
          Let's find out what's going on with {authContext.dogDetails.dogName}
        </Text>
      )}
      {!specificSignInpuVisible && (
        <Text style={styles.textSubHeading}>
          What clincal signs have you noticed?
        </Text>
      )}

      {specificSignInpuVisible ? (
        <TextInput
          placeholder="Enter the specific signs your dog is showing..."
          multiline={true}
          style={styles.specificSignInput}
          value={selectedSymptom}
          onChangeText={handleSpecificSignChange}
        />
      ) : (
        <DropdownComponent
          options={commonSymptoms}
          placeholderText="Select a sign"
          onValueChange={handleSymptomChange}
          customStyle={{ alignItems: "flex-start", marginBottom: 24 }}
        />
      )}

      {!specificSignInpuVisible && (
        <TouchableOpacity
          onPress={() => {
            setSpecificSignInputVisible(true);
            setSelectedSymptom("");
          }}
        >
          <Text style={styles.cantFindClinicalSignText}>
            Can't find your dog's clinical sign?
          </Text>
        </TouchableOpacity>
      )}

      {specificSignInpuVisible && (
        <TouchableOpacity
          onPress={() => {
            setSpecificSignInputVisible(false);
            setSelectedSymptom("");
          }}
        >
          <Text style={styles.cantFindClinicalSignText}>
            Choose clinical signs
          </Text>
        </TouchableOpacity>
      )}

      {buttonVisible && (
        <TouchableOpacity
          style={styles.diagnoseButton}
          onPress={handleOnSubmitClick}
        >
          <Text style={styles.diagnoseButtonText}>Diagnose</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (symptomSubmitted) {
    content = (
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        <View style={styles.tellUsMoreContainer}>
          <Text style={styles.tellUsMoreText}>
            Let's dive deeper to ensure {authContext.dogDetails.dogName} gets
            the best care.
          </Text>
        </View>
        {followUpQuestions.map((item, index) => (
          <View key={index}>
            <Text style={styles.questionLabel}>{item.question}</Text>
            {item.answers && item.answers.length > 0 ? (
              <DropdownComponent
                options={item.answers}
                placeholderText="Provide answer"
                onValueChange={(value) =>
                  handleAnswerChange(item.question, value)
                }
                customStyle={{ alignItems: "flex-start", marginBottom: 16 }}
              />
            ) : undefined}
          </View>
        ))}
        {Object.keys(answers).length === followUpQuestions.length ? (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleOnContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        ) : undefined}
      </ScrollView>
    );
  }

  if (diagnoseComplete) {
    content = (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 32 }}
      >
        <DiagnoseReport selectedSymptom={selectedSymptom} data={aiResponse} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {content}
      {diagnoseComplete && (
        <TouchableOpacity
          style={styles.saveResultButton}
          onPress={handleOnSaveDiagnosis}
        >
          <Text style={styles.continueButtonText}>Save Results</Text>
        </TouchableOpacity>
      )}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {diagnoseComplete && !isResultSaved ? (
            <CompleteAnimation
              animationName="complete-check"
              animationHeading="Diagnosis Complete!"
              animationSubHeading="Tap below to view the detailed results."
              buttonText="View Results"
              onViewResult={() => setIsModalVisible(false)} // Only close the modal
            />
          ) : isResultSaved ? (
            <CompleteAnimation
              animationName="complete-check2"
              animationHeading="Diagnosis saved successfully!"
              animationSubHeading="Your data is securely stored. Tap the button below to return to the home screen."
              buttonText="Return"
              onViewResult={handleModalClose} // Navigate back to HomeScreen
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

export default DiagnoseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 60,
  },

  textHeading: {
    fontFamily: "inter-regular",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    lineHeight: 36,
  },

  textSubHeading: {
    fontFamily: "inter-regular",
    fontSize: 16,
    color: "#666666",
    marginTop: 32,
    marginBottom: 14,
  },

  tellUsMoreContainer: {
    marginBottom: 32,
  },

  tellUsMoreText: {
    fontFamily: "inter-regular",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 4,
    color: "#333333",
    lineHeight: 36,
  },

  questionLabel: {
    fontFamily: "inter-regular",
    fontSize: 18,
    fontWeight: "medium",
    textAlign: "left",
    lineHeight: 28,
    color: "#333333",
    marginTop: 16,
    marginBottom: 12,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8FF",
    paddingHorizontal: 24,
  },

  diagnoseButton: {
    width: "100%",
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
  },
  continueButton: {
    width: "100%",
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 32,
  },

  saveResultButton: {
    width: "100%",
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },

  diagnoseButtonText: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },

  continueButtonText: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },

  cantFindClinicalSignText: {
    fontFamily: "inter-medium",
    color: "#007BFF",
    marginBottom: 24,
  },

  specificSignInput: {
    fontFamily: "inter-regular",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    fontSize: 16,
    padding: 14,
    marginVertical: 16,
  },
});
