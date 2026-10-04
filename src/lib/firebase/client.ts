"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfig from "../../../firebase-applet-config.json";

// Initialize Firebase App instance using initializeApp
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth instance using getAuth
export const auth: Auth = getAuth(app);

// Initialize Firestore instance using initializeFirestore with experimentalForceLongPolling
// This ensures reliable connections in cloud container/iframe/proxy environments
let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    firebaseConfig.firestoreDatabaseId || undefined
  );
} catch {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const firestore: Firestore = firestoreInstance;

// Export db alias for firestore
export const db: Firestore = firestore;

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Connection verification test with non-blocking timeout
export async function verifyFirestoreConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("connection timeout")), 3500)
    );
    await Promise.race([
      getDocFromServer(doc(firestore, "test", "connection")),
      timeoutPromise,
    ]);
    return true;
  } catch (error: any) {
    const msg = error?.message || "";
    if (msg.includes("the client is offline") || msg.includes("connection timeout")) {
      console.warn("Firestore connection check notice:", msg);
      return false;
    }
    // Expected to error with permission-denied or document-not-found when unauthenticated, which still confirms server handshake
    return true;
  }
}

// User Profile persistence model
export interface FirestoreUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: string;
  organization: string;
  clearance: string;
  callsign: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt: string;
  preferences?: {
    defaultMapMode?: string;
    theme?: string;
    reducedMotion?: boolean;
    highContrast?: boolean;
  };
}

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path,
  };
  console.warn("Firestore Operation Notice:", JSON.stringify(errInfo));
}

export async function syncUserProfile(
  user: FirebaseUser,
  extraData?: Partial<FirestoreUserProfile>
): Promise<FirestoreUserProfile | null> {
  if (!user.uid) return null;
  const userRef = doc(firestore, "users", user.uid);
  try {
    const existing = await getDoc(userRef);
    const now = new Date().toISOString();
    const profile: FirestoreUserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || extraData?.displayName || "Strategic Operator",
      photoURL: user.photoURL || undefined,
      role: existing.exists() ? existing.data()?.role : (extraData?.role || "OPERATOR"),
      organization: existing.exists() ? existing.data()?.organization : (extraData?.organization || "National Crisis Command"),
      clearance: existing.exists() ? existing.data()?.clearance : (extraData?.clearance || "Level 4 Strategic"),
      callsign: existing.exists() ? existing.data()?.callsign : (extraData?.callsign || "COMMAND-01"),
      createdAt: existing.exists() ? existing.data()?.createdAt : now,
      updatedAt: now,
      lastLoginAt: now,
      preferences: existing.exists() ? existing.data()?.preferences : {
        defaultMapMode: "3D_GLOBE",
        theme: "DARK_TACTICAL",
        reducedMotion: false,
      },
    };
    await setDoc(userRef, profile, { merge: true });
    return profile;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    return null;
  }
}

// Tactical Logs & Transcriptions persistence
export interface TacticalLogItem {
  id?: string;
  userId: string;
  title: string;
  content: string;
  source: "VOICE_TRANSCRIPTION" | "MAPS_GROUNDING" | "FIELD_NOTE" | "INCIDENT_UPDATE";
  sector?: string;
  coordinates?: { lat: number; lng: number };
  groundingData?: any;
  createdAt: string;
}

export async function addTacticalLog(
  userId: string,
  log: Omit<TacticalLogItem, "userId" | "createdAt">
): Promise<string | null> {
  try {
    const logsRef = collection(firestore, "users", userId, "tactical_logs");
    const docRef = await addDoc(logsRef, {
      ...log,
      userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `users/${userId}/tactical_logs`);
    return null;
  }
}

export function subscribeTacticalLogs(
  userId: string,
  callback: (logs: TacticalLogItem[]) => void
) {
  const logsRef = collection(firestore, "users", userId, "tactical_logs");
  const q = query(logsRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const logs: TacticalLogItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<TacticalLogItem, "id">),
      }));
      callback(logs);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${userId}/tactical_logs`);
    }
  );
}

// Export Auth & Firestore Primitives
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  fbSignOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
};

export default { app, auth, firestore, db };
