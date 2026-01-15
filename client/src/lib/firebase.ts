import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCP73SGtu1LEdXR2E-rbes32BHq-R3mxZ8",
  authDomain: "slotlab-4bc1e.firebaseapp.com",
  projectId: "slotlab-4bc1e",
  storageBucket: "slotlab-4bc1e.firebasestorage.app",
  messagingSenderId: "294267591214",
  appId: "1:294267591214:web:367282bc013b63f20f1dbf",
  measurementId: "G-9F94YJQLZ4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);