import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = require('../../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();

// Collection references
export const usersCollection = () => db.collection('users');
export const spinsCollection = (uid: string) => 
  db.collection('users').doc(uid).collection('spins');
export const statsCollection = (uid: string) => 
  db.collection('users').doc(uid).collection('stats');

export default admin;