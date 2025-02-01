import axios from "axios";

import { FIREBASE_API_KEY as API_KEY } from "../api/apiKey";
import { date } from "zod";
import { use } from "react";
const BACKEND_URL = "https://woof-wise-4b82b-default-rtdb.firebaseio.com";

export async function fetchUsers() {
  const url = `${BACKEND_URL}/users.json`;
  const response = await axios.get(url).catch((error) => {
    console.error(
      "Error fetching users: ",
      error.response?.data || error.message
    );
    throw error;
  });

  let users = [];

  for (const key in response.data) {
    const userObject = {
      id: key,
      authUserId: response.data[key].authUserId,
      firstName: response.data[key].firstName,
      lastName: response.data[key].lastName,
      email: response.data[key].email,
      hasCompletedDogSetup: response.data[key].hasCompletedDogSetup,
      imageProfileUri: response.data[key].imageProfileUri,
    };

    users.push(userObject);
  }

  return users;
}

export async function getUserById(authUserId) {
  const allUsers = await fetchUsers();
  let user;
  allUsers.map((userObject) => {
    if (userObject.authUserId === authUserId) {
      user = userObject;
    }
  });

  return user;
}

export async function fetchDogs(userId) {
  const url = `${BACKEND_URL}/dogs.json`;
  const response = await axios.get(url);

  let dogs = [];

  for (const key in response.data) {
    if (response.data[key].userId === userId) {
      const dogObject = {
        id: key,
        userId: response.data[key].userId,
        dogName: response.data[key].dogName,
        dogGender: response.data[key].dogGender,
        dogBirthday: response.data[key].dogBirthday,
        dogAge: response.data[key].dogAge,
        dogBreed: response.data[key].dogBreed,
        spayed: response.data[key].spayed,
        neutered: response.data[key].neutered,
        dogWeight: response.data[key].dogWeight,
        imageProfileUri: response.data[key].imageProfileUri,
      };
      dogs.push(dogObject);
    }
  }

  return dogs;
}

export async function getDogDetails(dogId, currentUserId, allDogAccounts) {
  let dogDetails;

  allDogAccounts.map((dogDetailObject) => {
    if (
      dogDetailObject.userId === currentUserId &&
      dogDetailObject.id === dogId
    ) {
      dogDetails = dogDetailObject;
    }
  });

  return dogDetails;
}

// asyncrhonous
export async function getDogDetails2(dogId, currentUserId) {
  const allDogs = await fetchDogs(currentUserId);
  let dogDetails;

  allDogs.map((dogDetailObject) => {
    if (
      dogDetailObject.userId === currentUserId &&
      dogDetailObject.id === dogId
    ) {
      dogDetails = dogDetailObject;
    }
  });

  return dogDetails;
}

export async function getDiagnoseHistory(currentUserId, currentDogId) {
  const url = `${BACKEND_URL}/diagnoses.json`;
  const response = await axios.get(url);

  let diagnoseHistoryLists = [];

  for (const key in response.data) {
    const dogId = response.data[key].dogId;
    const userId = response.data[key].userId;

    if (userId === currentUserId && dogId === currentDogId) {
      diagnoseHistoryLists.push({ ...response.data[key], diagnoseId: key });
    }
  }

  return diagnoseHistoryLists;
}

export async function getVaccinationRecords(currentUserId, currentDogId) {
  const url = `${BACKEND_URL}/vaccines.json`;
  const response = await axios.get(url);

  let vaccineRecordLists = [];

  for (const key in response.data) {
    const dogId = response.data[key].dogId;
    const userId = response.data[key].userId;

    if (userId === currentUserId && dogId === currentDogId) {
      vaccineRecordLists.push({ ...response.data[key], vaccineId: key });
    }
  }

  return vaccineRecordLists;
}

export async function getVaccineById(vaccineId) {
  const url = `${BACKEND_URL}/vaccines/${vaccineId}.json`;
  const response = axios.get(url);
  return (await response).data;
}

export async function getDiagnosisNotes(currentUserId, currentDogId) {
  const url = `${BACKEND_URL}/diagnosisNotes.json`;
  const response = await axios.get(url);

  let diagnosisNotesList = [];

  for (const key in response.data) {
    const dogId = response.data[key].dogId;
    const userId = response.data[key].userId;

    if (userId === currentUserId && dogId === currentDogId) {
      diagnosisNotesList.push({ ...response.data[key], noteId: key });
    }
  }

  console.log("Notes List Fetched: ", diagnosisNotesList);

  return diagnosisNotesList;
}

export async function getVetVisitRecords(currentDogId) {
  const url = `${BACKEND_URL}/vetVisits.json`;
  const response = await axios.get(url);

  let recordLists = [];

  for (const key in response.data) {
    const dogId = response.data[key].dogId;

    if (dogId === currentDogId) {
      recordLists.push({ ...response.data[key], recordId: key });
    }
  }

  console.log(recordLists);

  return recordLists;
}

export async function getVetVisitRecordById(recordId) {
  const url = `${BACKEND_URL}/vetVisits/${recordId}.json`;
  const response = axios.get(url);
  return (await response).data;
}
