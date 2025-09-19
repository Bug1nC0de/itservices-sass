import { auth, firestore } from '../firebse-config';
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  getAuth,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import axios from 'axios';
import { setCredentials, removeCredentials } from '../slices/authSlice';
import { resetClient } from '../slices/clientSlice.js';
import { resetHelpdesk } from '../slices/helpDeskSlice.js';
import { resetUserState } from '../slices/userSlice.js';
import { resetSuppliersSlice } from '../slices/supplierSlice.js';
import { resetSales } from '../slices/salesSlice.js';
import { getClient } from '../api/users/userApi';
import { resetTodoSlice } from '../slices/todoSlice.js';
import { resetProjects } from '../slices/projectSlice.js';
import { resetITServices } from '../slices/callitservicesSlice.js';
import store from '../store.js';
const backend = import.meta.env.VITE_BACKEND_URL;

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

//Persit Login
export const persistLogin = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    signOut();
    return;
  }
  const credentials = currentUser.uid;

  const domain = currentUser.email.split('@').pop();

  if (!domain) return; // No email available
  if (domain === 'callitservices.co.za') {
    const q = query(
      collection(firestore, 'techs'),
      where('credentials', '==', credentials)
    );
    const myQuery = await getDocs(q);

    let profile = myQuery.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const profileType = 'itservices';
    store.dispatch(setCredentials({ ...profile[0], profileType }));
  } else {
    const userProfile = doc(firestore, 'users', credentials);
    const profile = await getDoc(userProfile);
    const myProfile = profile.data();
    const clientId = myProfile.clientId;
    const profileType = 'user';
    const id = credentials;
    await getClient(clientId);
    store.dispatch(setCredentials({ ...myProfile, profileType, id }));
  }
};

//Create a new user//
export const signUpBusiness = async ({
  businessName,
  accountHolder,
  address,
  number,
  email,
  password,
}) => {
  try {
    const body = JSON.stringify({
      businessName,
      accountHolder,
      address,
      number,
      email,
      password,
    });

    const response = await axios.post(
      `${backend}/api/firebase-admin/create-new-client`,
      body,
      config
    );

    return response.data;
  } catch (error) {
    const errors = error.response.data.errors;

    throw errors;
  }
};

//Login a user//
export const signInUser = async ({ email, password }) => {
  try {
    const a = await signInWithEmailAndPassword(auth, email, password);
    const user = a.user;

    return user;
  } catch (error) {
    console.error('Error Loggin in : ', error);
    throw error;
  }
};

//Resend Email Verification//
export const resendEmailVerification = async () => {
  try {
    const auth = getAuth();
    await sendEmailVerification(auth.currentUser);
    return 'success';
  } catch (error) {
    console.error('Error Sending email verification: ', error);
    return 'failed';
  }
};

//Reset User Password//
export const resetMyPassword = async (email) => {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    return 'success';
  } catch (error) {
    console.error('Error Resseting Password: ', error);
    return 'failed';
  }
};

//Sign Out User//
export const signOutUser = async () => {
  try {
    if (auth) {
      await signOut(auth);
    }

    store.dispatch(removeCredentials());
    store.dispatch(resetClient());
    store.dispatch(resetHelpdesk());
    store.dispatch(resetUserState());
    store.dispatch(resetSuppliersSlice());
    store.dispatch(resetSales());
    store.dispatch(resetTodoSlice());
    store.dispatch(resetProjects());
    store.dispatch(resetITServices());
    return 'success';
  } catch (error) {
    console.error('Error Signing User Out: ', error);
    return 'failed';
  }
};
