import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../../firebse-config';
import store from '../../store';
import {
  setClient,
  setClients,
  setUser,
  setUsers,
} from '../../slices/clientSlice';

//Create Client//
export const createUserClient = async ({
  name,
  email,
  number,
  address,
  createdAt,
  clientId,
}) => {
  const clientRef = collection(firestore, 'user_clients');
  try {
    await addDoc(clientRef, {
      name,
      email,
      number,
      address,
      createdAt,
      clientId,
    });
    console.log('Alert success');
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

//Fetch Clients//
export const getUserClients = async (clientId) => {
  try {
    const q = query(
      collection(firestore, 'user_clients'),
      where('clientId', '==', clientId),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);

    let userClients = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setClients(userClients));
  } catch (error) {
    console.error('Error fetching users: ', error);
  }
};

//Get Client users//
export const getClientUsers = async (clientId) => {
  try {
    const q = query(
      collection(firestore, 'user_client_users'),
      where('user_clientId', '==', clientId),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);

    let users = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(users);
    store.dispatch(setUsers(users));
  } catch (error) {
    console.error('Error fetching users: ', error);
  }
};

//Update User Clients//
export const updateUserClient = async ({
  name,
  email,
  number,
  address,
  clientId,
}) => {
  const clientRef = doc(firestore, 'user_clients', clientId);
  try {
    const newFields = {
      name: name,
      email: email,
      number: number,
      address: address,
    };
    await updateDoc(clientRef, newFields);
    console.log('Alert success');
    console.log('Get updated user: ', clientId);
    await getUsersClient(clientId);
  } catch (error) {
    console.error('Error updating user client: ', error);
  }
};

//Update Users Client user//
export const updateClientsUser = async ({
  name,
  surname,
  cellphone,
  position,
  userId,
}) => {
  const userRef = doc(firestore, 'user_client_users', userId);
  try {
    const newFields = {
      name: name,
      surname: surname,
      cellphone: cellphone,
      position: position,
    };
    await updateDoc(userRef, newFields);
    console.log('Alert success');
    console.log('Get updated user: ', userId);
    await getUserClientUser(userId);
  } catch (error) {
    console.log(error.message);
  }
};

//Get a users client//
export const getUsersClient = async (clientId) => {
  const clientRef = doc(firestore, 'user_clients', clientId);

  const clientDoc = await getDoc(clientRef);
  const client = clientDoc.data();
  console.log('The client: ', client);

  store.dispatch(setClient(client));
};

//Get a user client's user //
export const getUserClientUser = async (userId) => {
  const userRef = doc(firestore, 'user_client_users', userId);
  const userDoc = await getDoc(userRef);
  const user = userDoc.data();

  console.log('The user: ', user);
  store.dispatch(setUser(user));
};
