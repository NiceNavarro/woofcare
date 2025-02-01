import { createContext, useState } from "react";

export const AuthContext = createContext({
  token: "",
  authUserId: "",
  currentUserId: "",
  currentDogId: "",
  isAuthenticated: false,
  userDetails: null,
  dogDetails: null,

  //database
  diagnosis: [],
  vaccines: [],
  diagnosisNotes: [],
  vetVisitRecords: [],

  authenticate: (authUserId) => {},
  setUser: (currentUserId) => {},
  setUserAccountDetails: (userDetails) => {},
  setDog: (dogDetails) => {},
  setDogId: (currentDogId) => {},

  //database
  setDiagnosis: (diagnoseData) => {},
  setVaccines: (vaccineData) => {},
  setDiagnosisNotes: (notesData) => {},
  setVetVisitRecords: () => {},

  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [authUserId, setAuthUserId] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [currentDogId, setCurrentDogId] = useState();

  const [userDetails, setUserDetails] = useState();
  const [dogDetails, setDogDetails] = useState();
  const [diagnosis, setDiagnosisData] = useState([]);
  const [vaccines, setVaccineData] = useState([]);
  const [diagnosisNotes, setDiagnosisNotesData] = useState([]);
  const [vetVisitRecords, setVetVisitRecordsData] = useState([]);

  function authenticate(authUserId) {
    setAuthUserId(authUserId);
  }

  function setUser(currentUserId) {
    setCurrentUserId(currentUserId);
  }

  function setUserAccountDetails(details) {
    setUserDetails(details);
  }

  function setDog(dogDetails) {
    setDogDetails(dogDetails);
  }

  function setDogId(currentDogId) {
    setCurrentDogId(currentDogId);
  }

  function setDiagnosis(newDiagnoseData, replace = false) {
    if (replace) {
      setDiagnosisData(newDiagnoseData); // replace the array
    } else {
      setDiagnosisData((previousDiagnoseData) => [
        ...previousDiagnoseData,
        ...newDiagnoseData,
      ]);
    }
  }

  function setVaccines(newVaccineData, replace = false) {
    if (replace) {
      setVaccineData(newVaccineData);
    } else {
      setVaccineData((previousVaccineData) => [
        ...previousVaccineData,
        ...newVaccineData,
      ]);
    }
  }

  function setDiagnosisNotes(newNotesData, replace = false) {
    if (replace) {
      setDiagnosisNotesData(newNotesData);
    } else {
      setDiagnosisNotesData((previouseData) => [
        ...previouseData,
        ...newNotesData,
      ]);
    }
  }

  function setVetVisitRecords(newVisitRecords, replace = false) {
    if (replace) {
      setVetVisitRecordsData(newVisitRecords);
    } else {
      setVetVisitRecordsData((previouseData) => [
        ...previouseData,
        ...newVisitRecords,
      ]);
    }
  }

  function logout() {
    setAuthToken(null);
    setAuthUserId(null);
    setCurrentUserId(null);
    setCurrentDogId(null);
    setUserDetails(null);
    setDogDetails(null);
    setDiagnosisData([]);
    setVaccineData([]);
    setDiagnosisNotesData([]);
    setVetVisitRecordsData([]);
  }

  const value = {
    token: authToken,
    authUserId: authUserId,
    currentUserId: currentUserId,
    isAuthenticated: !!authUserId,
    userDetails: userDetails,
    dogDetails: dogDetails,
    currentDogId: currentDogId,
    diagnosis: diagnosis,
    vaccines: vaccines,
    diagnosisNotes: diagnosisNotes,
    vetVisitRecords: vetVisitRecords,
    authenticate: authenticate,
    setUserAccountDetails: setUserAccountDetails,
    setUser: setUser,
    setDog: setDog,
    setDogId: setDogId,
    setDiagnosis: setDiagnosis,
    setVaccines: setVaccines,
    setDiagnosisNotes: setDiagnosisNotes,
    setVetVisitRecords: setVetVisitRecords,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
