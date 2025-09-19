import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken } from 'firebase/messaging';
import axios from 'axios';

const backend = import.meta.env.VITE_BACKEND_URL;

const firebase = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebase);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

export const generateToken = async ({ userId, type }) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const webtoken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      const body = JSON.stringify({ userId, webtoken, type });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.put(
        `${backend}/api/firebase-admin/update-user-webtoken`,
        body,
        config
      );
      return res;
    } else {
      console.warn('Notification permission not granted:', permission);
      return permission;
    }
  } catch (err) {
    console.error('🔥 Error getting FCM token:', err);
    return null;
  }
};
