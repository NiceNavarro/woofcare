import axios from "axios";

const DATABASE_URL = "https://woof-wise-4b82b-default-rtdb.firebaseio.com";

export async function deleteDiagnoseData(diagnoseId) {
  await axios.delete(`${DATABASE_URL}/diagnoses/${diagnoseId}.json`);
}

export async function deleteVaccine(vaccineId) {
  await axios.delete(`${DATABASE_URL}/vaccines/${vaccineId}.json`);
}

export async function deleteDiagnosisNote(noteId) {
  await axios.delete(`${DATABASE_URL}/diagnosisNotes/${noteId}.json`);
}

export async function deleteAllDiagnosisNote(diagnoseId) {
  const response = await axios.get(`${DATABASE_URL}/diagnosisNotes/.json`);
  const diagnosisNotes = response.data;

  try {
    if (!diagnosisNotes) {
      console.log("No data found.");
      return;
    }

    const deletePromises = Object.keys(diagnosisNotes).map(async (key) => {
      if (diagnosisNotes[key].diagnoseId === diagnoseId) {
        return axios.delete(`${DATABASE_URL}/diagnosisNotes/${key}.json`);
      }
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteVetVisitRecord(recordId) {
  await axios.delete(`${DATABASE_URL}/vetVisits/${recordId}.json`);
}
