
import { ClinicalNote, Patient } from "../types";

const STORAGE_KEY = 'medsentinel_encounters';

export const saveEncounter = (note: ClinicalNote) => {
  const existing = getEncounters();
  const index = existing.findIndex(e => e.id === note.id);
  if (index >= 0) {
    existing[index] = note;
  } else {
    existing.unshift(note);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50))); // Keep last 50
};

export const getEncounters = (): ClinicalNote[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearLocalEncounters = () => {
  localStorage.removeItem(STORAGE_KEY);
};
