import { firestore } from '../../firebse-config';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import {
  setClients,
  setClient,
  setUsers,
  setClientBranches,
  setClientDepartments,
  setUser,
} from '../../slices/clientSlice';
import store from '../../store';
import moment from 'moment';

//Fetch all clients//
export const fetchAllClients = async () => {
  const clientRef = collection(firestore, 'clients');

  const data = await getDocs(clientRef);
  try {
    let clients = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setClients(clients));
  } catch (error) {
    console.error(error.message);
  }
};

//Create Client//
export const createClient = async ({
  name,
  email,
  number,
  address,
  createdAt,
}) => {
  const clientRef = collection(firestore, 'clients');
  try {
    await addDoc(clientRef, {
      name,
      email,
      number,
      address,
      createdAt,
    });
    //   dispatch(setAlert('Client successfully created', 'success'));
    console.log('Alert successfull client creations');
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch a specific client//
export const fetchClient = async (clientId) => {
  try {
    const clientRef = doc(firestore, 'clients', clientId);
    const client = await getDoc(clientRef);
    const q = query(
      collection(firestore, 'users'),
      where('clientId', '==', clientId),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);

    const a = client.data();
    a.id = clientId;

    let clientUsers = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setClient(a));
    store.dispatch(setUsers(clientUsers));
  } catch (error) {
    console.error(error.message);
  }
};

//Create a branch//
export const createClientBranch = async ({ name, clientId, createdBy }) => {
  const branchRef = collection(firestore, 'branch');
  const createdAt = moment().format();
  const users = [];

  try {
    await addDoc(branchRef, {
      name,
      clientId,
      createdAt,
      users,
      createdBy,
    });
  } catch (error) {
    console.error('Error creating a branch: ', error);
  }
};

//Get branches//
export const getBranches = async (clientId) => {
  const branchRef = collection(firestore, 'branch');
  const q = query(branchRef, where('clientId', '==', clientId));

  try {
    onSnapshot(q, (snapshot) => {
      let branches = [];
      snapshot.docs.forEach((doc) => {
        branches.push({ ...doc.data(), id: doc.id });
      });
      //dispatch loot
      store.dispatch(setClientBranches(branches));
    });
  } catch (error) {
    console.error('Error fetching branches: ', error);
  }
};

//Create a department//
export const createClientDepartment = async ({ name, clientId, createdBy }) => {
  const depRef = collection(firestore, 'departments');
  const createdAt = moment().format();
  const users = [];
  try {
    await addDoc(depRef, {
      name,
      clientId,
      createdAt,
      users,
      createdBy,
    });
    console.log('alert success');
    console.log('Get departments: ', clientId);
  } catch (error) {
    console.error(error.message);
  }
};

//Get departments//
export const getDepartments = async (clientId) => {
  const depRef = collection(firestore, 'departments');
  const q = query(depRef, where('clientId', '==', clientId));

  try {
    onSnapshot(q, (snapshot) => {
      let departments = [];
      snapshot.docs.forEach((doc) => {
        departments.push({ ...doc.data(), id: doc.id });
      });

      //dispatch the loot
      store.dispatch(setClientDepartments(departments));
    });
  } catch (error) {
    console.error(error.mesasage);
  }
};

//Fetch a specific user//
export const fetchUser = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);

    const userDoc = await getDoc(userRef);
    const user = userDoc.data();

    store.dispatch(setUser(user));
  } catch (error) {
    console.error(error.message);
  }
};
