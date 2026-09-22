import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from './firebase';
import { Appointment, BusinessSettings } from '../types';
import { StorageService } from './storage';

const APPOINTMENTS_COLLECTION = 'appointments';
const SETTINGS_COLLECTION = 'settings';
const GENERAL_SETTINGS_DOC = 'general';

let isListening = false;
let unsubscribeAppointments: (() => void) | null = null;
let unsubscribeSettings: (() => void) | null = null;

export const FirestoreSync = {
  // Initialize real-time synchronization between Firestore and local state
  init(onUpdate?: () => void) {
    if (isListening) return;
    isListening = true;

    // Test connectivity gracefully
    testFirestoreConnection();

    // 1. Subscribe to real-time appointments
    try {
      const apptCol = collection(db, APPOINTMENTS_COLLECTION);
      unsubscribeAppointments = onSnapshot(
        apptCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteAppointments: Appointment[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as Appointment;
              remoteAppointments.push(data);
            });

            // Merge with local appointments by ID
            const localList = StorageService.getAppointments();
            const mergedMap = new Map<string, Appointment>();

            // Put local first
            localList.forEach(a => mergedMap.set(a.id, a));
            // Overwrite/add with remote
            remoteAppointments.forEach(a => mergedMap.set(a.id, a));

            const finalList = Array.from(mergedMap.values());
            // Sort by createdAt or date descending
            finalList.sort((a, b) => {
              const timeA = new Date(a.createdAt || a.date).getTime();
              const timeB = new Date(b.createdAt || b.date).getTime();
              return timeB - timeA;
            });

            localStorage.setItem('eemt_appointments_v2', JSON.stringify(finalList));
            if (onUpdate) onUpdate();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, APPOINTMENTS_COLLECTION);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, APPOINTMENTS_COLLECTION);
    }

    // 2. Subscribe to real-time business settings
    try {
      const settingsDocRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
      unsubscribeSettings = onSnapshot(
        settingsDocRef,
        (snap) => {
          if (snap.exists()) {
            const remoteSettings = snap.data() as BusinessSettings;
            const current = StorageService.getSettings();
            const merged = { ...current, ...remoteSettings };
            StorageService.saveSettings(merged);
            if (onUpdate) onUpdate();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/${GENERAL_SETTINGS_DOC}`);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${SETTINGS_COLLECTION}/${GENERAL_SETTINGS_DOC}`);
    }
  },

  // Write appointment to Firestore and mirror to LocalStorage
  async syncAppointment(appointment: Appointment): Promise<void> {
    // Save locally first for instantaneous responsiveness
    StorageService.saveAppointment(appointment);

    try {
      const docRef = doc(db, APPOINTMENTS_COLLECTION, appointment.id);
      // Clean undefined fields for Firestore compatibility
      const cleanData = JSON.parse(JSON.stringify(appointment));
      await setDoc(docRef, cleanData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${APPOINTMENTS_COLLECTION}/${appointment.id}`);
    }
  },

  // Update appointment in Firestore and mirror to LocalStorage
  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    const updated = StorageService.updateAppointment(id, updates);
    try {
      const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
      const cleanUpdates = JSON.parse(JSON.stringify(updates));
      await updateDoc(docRef, cleanUpdates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${APPOINTMENTS_COLLECTION}/${id}`);
    }
    return updated;
  },

  // Delete appointment in Firestore
  async deleteAppointment(id: string): Promise<boolean> {
    const res = StorageService.deleteAppointment(id);
    try {
      const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${APPOINTMENTS_COLLECTION}/${id}`);
    }
    return res;
  },

  // Save settings to Firestore
  async syncSettings(settings: BusinessSettings): Promise<void> {
    StorageService.saveSettings(settings);
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
      const cleanData = JSON.parse(JSON.stringify(settings));
      await setDoc(docRef, cleanData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COLLECTION}/${GENERAL_SETTINGS_DOC}`);
    }
  },

  // Upload any existing local appointments that aren't yet in Firestore
  async seedExistingAppointments(): Promise<void> {
    try {
      const localList = StorageService.getAppointments();
      const existingSnap = await getDocs(collection(db, APPOINTMENTS_COLLECTION));
      const existingIds = new Set<string>();
      existingSnap.forEach(d => existingIds.add(d.id));

      for (const appt of localList) {
        if (!existingIds.has(appt.id)) {
          const cleanData = JSON.parse(JSON.stringify(appt));
          await setDoc(doc(db, APPOINTMENTS_COLLECTION, appt.id), cleanData);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, APPOINTMENTS_COLLECTION);
    }
  },

  cleanup() {
    if (unsubscribeAppointments) {
      unsubscribeAppointments();
      unsubscribeAppointments = null;
    }
    if (unsubscribeSettings) {
      unsubscribeSettings();
      unsubscribeSettings = null;
    }
    isListening = false;
  }
};
