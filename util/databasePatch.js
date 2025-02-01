import axios from "axios";

import { FIREBASE_API_KEY as API_KEY } from "../api/apiKey";
const BACKEND_URL = "https://woof-wise-4b82b-default-rtdb.firebaseio.com";

export async function editUser(userId, updatedData) {
  await axios.patch(`${BACKEND_URL}/users/${userId}.json`, updatedData);
}

export async function editVaccine(vaccineId, updatedData) {
  const response = await axios.patch(
    `${BACKEND_URL}/vaccines/${vaccineId}.json`,
    updatedData
  );
  return response.name;
}

export async function editVisitRecord(recordId, updatedData) {
  const response = await axios.patch(
    `${BACKEND_URL}/vetVisits/${recordId}.json`,
    updatedData
  );
  return response.name;
}

export async function editDog(dogId, updatedData) {
  const response = await axios.patch(
    `${BACKEND_URL}/dogs/${dogId}.json`,
    updatedData
  );
  return response.name;
}

export async function editUserProfileImage(userId, updatedData) {
  const response = await axios.patch(
    `${BACKEND_URL}/users/${userId}.json`,
    updatedData
  );
  return response.name;
}

export async function editDogProfileImage(dogId, updatedData) {
  const response = await axios.patch(
    `${BACKEND_URL}/dogs/${dogId}.json`,
    updatedData
  );
  return response.name;
}

export async function removeUserProfileImage(userId, updatedData) {
  const response = await axios.patch(
    `${BACKEND_URL}/users/${userId}.json`,
    updatedData
  );
  return response.name;
}

export async function removeDogProfileImage(dogId, updatedData) {
  const response = await axios.patch(
    `${BACKEND_URL}/dogs/${dogId}.json`,
    updatedData
  );
  return response.name;
}
