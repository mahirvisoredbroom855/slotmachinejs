import * as admin from "firebase-admin";

/**
 * In Firebase Functions, we check if the app is already initialized.
 * We also remove the local serviceAccount JSON requirement as the
 * environment provides credentials automatically.
 */
if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();

// Collection references
export const usersCollection = () => db.collection("users");
export const spinsCollection = (uid: string) =>
  db.collection("users").doc(uid).collection("spins");
export const statsCollection = (uid: string) =>
  db.collection("users").doc(uid).collection("stats");

export default admin;
