import axios from "axios";

const DATABASE_URL = "https://woof-wise-4b82b-default-rtdb.firebaseio.com";

export async function storeUser(userData) {
  const url = DATABASE_URL + "/users.json";
  const response = await axios.post(url, userData);
  return response.data.name;
}

export async function saveDogDetails(dogData) {
  const url = DATABASE_URL + "/dogs.json";
  const response = await axios.post(url, dogData);
  return response.data.name;
}

export async function saveDogDiagnosis(diagnoseData) {
  const url = DATABASE_URL + "/diagnoses.json";
  const response = await axios.post(url, diagnoseData);
  return response.data.name;
}

export async function saveVaccination(vaccinationFormData) {
  const url = DATABASE_URL + "/vaccines.json";
  const response = await axios.post(url, vaccinationFormData);
  return response.data.name;
}

export async function saveDiagnosisNotes(notesData) {
  const url = DATABASE_URL + "/diagnosisNotes.json";
  const response = await axios.post(url, notesData);
  return response.data.name;
}

export async function saveVetVisitRecord(recordsData) {
  const url = DATABASE_URL + "/vetVisits.json";
  const response = await axios.post(url, recordsData);
  return response.data.name;
}
