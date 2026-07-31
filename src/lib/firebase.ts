import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Moderator } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Firestore Collection Reference
const MODERATORS_COLLECTION = 'moderators';

// Helper: Fetch all moderators from Firebase Firestore
export const fetchModeratorsFromFirebase = async (): Promise<Moderator[]> => {
  try {
    const colRef = collection(db, MODERATORS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const list: Moderator[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        name: data.name || '',
        designation: data.designation || '',
        number: data.number || '',
        nid: data.nid || '',
        dateOfBirth: data.dateOfBirth || '',
        gmail: data.gmail || '',
        password: data.password || '',
        newPassword: data.newPassword || '',
        permissions: data.permissions || {
          fullControl: false,
          newsManagement: false,
          categoryManagement: false,
          adRequests: false,
          userSubmissions: false
        },
        isBanned: !!data.isBanned,
        createdAt: data.createdAt || new Date().toISOString(),
        createdBy: data.createdBy || 'Admin'
      });
    });
    return list;
  } catch (error) {
    console.error('Error fetching moderators from Firebase:', error);
    return [];
  }
};

// Helper: Subscribe to real-time updates for moderators
export const subscribeToModerators = (onUpdate: (moderators: Moderator[]) => void) => {
  try {
    const colRef = collection(db, MODERATORS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const list: Moderator[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name || '',
          designation: data.designation || '',
          number: data.number || '',
          nid: data.nid || '',
          dateOfBirth: data.dateOfBirth || '',
          gmail: data.gmail || '',
          password: data.password || '',
          newPassword: data.newPassword || '',
          permissions: data.permissions || {
            fullControl: false,
            newsManagement: false,
            categoryManagement: false,
            adRequests: false,
            userSubmissions: false
          },
          isBanned: !!data.isBanned,
          createdAt: data.createdAt || new Date().toISOString(),
          createdBy: data.createdBy || 'Admin'
        });
      });
      onUpdate(list);
    }, (error) => {
      console.error('Error in moderators snapshot listener:', error);
    });
  } catch (error) {
    console.error('Failed to subscribe to moderators:', error);
    return () => {};
  }
};

// Helper: Add a new moderator to Firebase Firestore
export const addModeratorToFirebase = async (modData: Omit<Moderator, 'id'>): Promise<string | null> => {
  try {
    const colRef = collection(db, MODERATORS_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...modData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding moderator to Firebase:', error);
    throw error;
  }
};

// Helper: Update a moderator in Firebase Firestore
export const updateModeratorInFirebase = async (id: string, updates: Partial<Moderator>): Promise<void> => {
  try {
    const docRef = doc(db, MODERATORS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error(`Error updating moderator ${id} in Firebase:`, error);
    throw error;
  }
};

// Helper: Toggle ban status of a moderator in Firebase
export const toggleBanModeratorInFirebase = async (id: string, currentBanStatus: boolean): Promise<void> => {
  try {
    const docRef = doc(db, MODERATORS_COLLECTION, id);
    await updateDoc(docRef, { isBanned: !currentBanStatus });
  } catch (error) {
    console.error(`Error toggling ban for moderator ${id}:`, error);
    throw error;
  }
};

// Helper: Delete a moderator from Firebase Firestore
export const deleteModeratorFromFirebase = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, MODERATORS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting moderator ${id} from Firebase:`, error);
    throw error;
  }
};

// Helper: Authenticate moderator by gmail & password from Firebase
export const authenticateModeratorWithFirebase = async (gmailInput: string, passwordInput: string): Promise<{ success: boolean; moderator?: Moderator; errorMsg?: string }> => {
  try {
    const colRef = collection(db, MODERATORS_COLLECTION);
    const q = query(colRef, where('gmail', '==', gmailInput.trim().toLowerCase()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, errorMsg: 'invalid_credentials' };
    }

    let foundMod: Moderator | null = null;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      // Match password or newPassword if updated
      const activePassword = data.newPassword || data.password;
      if (activePassword === passwordInput || data.password === passwordInput) {
        foundMod = {
          id: docSnap.id,
          name: data.name || '',
          designation: data.designation || '',
          number: data.number || '',
          nid: data.nid || '',
          dateOfBirth: data.dateOfBirth || '',
          gmail: data.gmail || '',
          password: data.password || '',
          newPassword: data.newPassword || '',
          permissions: data.permissions || {
            fullControl: false,
            newsManagement: false,
            categoryManagement: false,
            adRequests: false,
            userSubmissions: false
          },
          isBanned: !!data.isBanned,
          createdAt: data.createdAt || new Date().toISOString(),
          createdBy: data.createdBy || 'Admin'
        };
      }
    });

    if (!foundMod) {
      return { success: false, errorMsg: 'invalid_credentials' };
    }

    const mod = foundMod as Moderator;
    if (mod.isBanned) {
      return { success: false, errorMsg: 'banned', moderator: mod };
    }

    return { success: true, moderator: mod };
  } catch (error) {
    console.error('Firebase moderator auth error:', error);
    return { success: false, errorMsg: 'network_error' };
  }
};
