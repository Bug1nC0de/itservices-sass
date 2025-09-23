import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  addDoc,
} from 'firebase/firestore';
import { firestore } from '../../firebse-config';
import moment from 'moment';
import store from '../../store';
import {
  setUsers,
  setClient,
  setBranches,
  setDepartments,
} from '../../slices/userSlice';

//Get The Client//
export const getClient = async (clientId) => {
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
};

//Get client users//
export const getClientUsers = async (clientId) => {
  try {
    const q = query(
      collection(firestore, 'users'),
      where('clientId', '==', clientId),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);

    let clientUsers = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(clientUsers);
  } catch (error) {
    console.error('Error fetching users: ', error);
  }
};

//Create a branch//
export const createBranch = async ({ name, clientId, createdBy }) => {
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
      store.dispatch(setBranches(branches));
    });
  } catch (error) {
    console.error('Error fetching branches: ', error);
  }
};

//Get a branch//
export const getBranch = async (branchId) => {
  const branchRef = doc(firestore, 'branch', branchId);
  try {
    const branchDoc = await getDoc(branchRef);
    const branch = branchDoc.data();
    console.log('This is the branch: ', branch);
    let clientId = branch.clientId;

    console.log('Get current user clients : ', clientId);
  } catch (error) {
    console.error(error.message);
  }
};

//Add to branch//
export const addToBranch = async ({ branchId, newUsers }) => {
  const branchRef = doc(firestore, 'branch', branchId);
  const branchDoc = await getDoc(branchRef);
  const branch = branchDoc.data();

  try {
    let users = branch.users;
    let newArr = users.concat(newUsers);
    const newFields = { users: newArr };
    await updateDoc(branchRef, newFields);

    console.log('Get branch: ', branchId);
    console.loog('Alert success');
  } catch (error) {
    console.error(error.message);
  }
};

//Remove users from branch//
export const removeFromBranch = async ({ branchId, removeFromArr }) => {
  const branchRef = doc(firestore, 'branch', branchId);
  const branchDoc = await getDoc(branchRef);
  const branch = branchDoc.data();
  const a = branch.users.length - removeFromArr.length;

  try {
    removeFromArr.forEach((id) => {
      let currentUsers = branch.users;

      async function removeFunc(arr) {
        let userArr = arr;

        arr.forEach((user, index) => {
          let userId = user.userId;
          if (userId === id) {
            userArr.splice(index, 1);
          }
        });

        if (userArr.length === a) {
          const newFields = { users: userArr };
          await updateDoc(branchRef, newFields);
          console.log('Get Branch: ', branchId);
          console.log('Alert success');
        }
      }

      removeFunc(currentUsers);
    });
  } catch (error) {
    console.error(error.message);
  }
};

//Create a department//
export const createDepartment = async ({ name, clientId, createdBy }) => {
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
      console.log('Client Departments: ', departments);
      store.dispatch(setDepartments(departments));
    });
  } catch (error) {
    console.error(error.mesasage);
  }
};

//Get department//
export const getDepartment = async (departmentId) => {
  const depRef = doc(firestore, 'departments', departmentId);
  try {
    const depDoc = await getDoc(depRef);
    const department = depDoc.data();
    console.log('The department: ', department);
    let clientId = department.clientId;

    console.log('Get the client: ', clientId);
  } catch (error) {
    console.error(error.message);
  }
};

//Add To Department//
export const addToDepartment = async ({ departmentId, newUsers }) => {
  const depRef = doc(firestore, 'departments', departmentId);
  const depDoc = await getDoc(depRef);
  const dep = depDoc.data();

  try {
    const users = dep.users;
    const newArr = users.concat(newUsers);
    const newFields = { users: newArr };
    await updateDoc(depRef, newFields);
    console.log('Get department: ', departmentId);
    console.log('Alert success');
  } catch (error) {
    console.error(error.message);
  }
};

//Remove from department//
export const removeFromDepartment = async ({ departmentId, removeFromArr }) => {
  const depRef = doc(firestore, 'departments', departmentId);
  const depDoc = await getDoc(depRef);
  const dep = depDoc.data();
  const a = dep.users.length - removeFromArr.length;
  try {
    removeFromArr.forEach((id) => {
      let currentUsers = dep.users;

      async function removeFunc(arr) {
        let userArr = arr;

        arr.forEach((user, index) => {
          let userId = user.userId;
          if (userId === id) {
            userArr.splice(index, 1);
          }
        });

        if (userArr.length === a) {
          const newFields = { users: userArr };
          await updateDoc(depRef, newFields);
          console.log('Get department: ', departmentId);
          console.log('Alert success');
        }
      }

      removeFunc(currentUsers);
    });
  } catch (error) {
    console.error(error.mesasage);
  }
};
