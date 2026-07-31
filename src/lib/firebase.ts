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
  onSnapshot,
  setDoc,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Moderator, SiteSettings, Article, Category, BannerAd, AdRequest, SubmittedNews, Comment } from '../types';

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

// Site Settings Firebase Helpers
const SETTINGS_DOC_REF = doc(db, 'settings', 'site_config');

export const fetchSiteSettingsFromFirebase = async (): Promise<SiteSettings | null> => {
  try {
    const snap = await getDoc(SETTINGS_DOC_REF);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return null;
  } catch (err) {
    console.error('Error fetching site settings from Firebase:', err);
    return null;
  }
};

export const saveSiteSettingsToFirebase = async (settings: SiteSettings): Promise<void> => {
  try {
    await setDoc(SETTINGS_DOC_REF, settings, { merge: true });
  } catch (err) {
    console.error('Error saving site settings to Firebase:', err);
  }
};

export const subscribeToSiteSettings = (onUpdate: (settings: SiteSettings) => void) => {
  try {
    return onSnapshot(SETTINGS_DOC_REF, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as SiteSettings);
      }
    }, (error) => {
      console.error('Error in site settings snapshot listener:', error);
    });
  } catch (error) {
    console.error('Failed to subscribe to site settings:', error);
    return () => {};
  }
};

// Generic Content Document Sync Factory for Firestore
const createDocSyncHelpers = <T>(collectionName: string, documentName: string) => {
  const docRef = doc(db, collectionName, documentName);
  
  return {
    fetch: async (): Promise<T[] | null> => {
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.list)) {
            return data.list as T[];
          }
        }
        return null;
      } catch (err) {
        console.error(`Error fetching ${collectionName}/${documentName}:`, err);
        return null;
      }
    },
    save: async (list: T[]): Promise<void> => {
      try {
        await setDoc(docRef, { list, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.error(`Error saving ${collectionName}/${documentName}:`, err);
      }
    },
    subscribe: (onUpdate: (list: T[]) => void) => {
      try {
        return onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data.list)) {
              onUpdate(data.list as T[]);
            }
          }
        }, (error) => {
          console.error(`Error in snapshot listener for ${collectionName}/${documentName}:`, error);
        });
      } catch (error) {
        console.error(`Failed to subscribe to ${collectionName}/${documentName}:`, error);
        return () => {};
      }
    }
  };
};

export const articlesFirebase = createDocSyncHelpers<Article>('content', 'articles');
export const categoriesFirebase = createDocSyncHelpers<Category>('content', 'categories');
export const bannerAdsFirebase = createDocSyncHelpers<BannerAd>('content', 'banner_ads');
export const adRequestsFirebase = createDocSyncHelpers<AdRequest>('content', 'ad_requests');
export const submittedNewsFirebase = createDocSyncHelpers<SubmittedNews>('content', 'submitted_news');
export const commentsFirebase = createDocSyncHelpers<Comment>('content', 'comments');

