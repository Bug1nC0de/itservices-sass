import { firestore } from '../../firebse-config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { setUsers, setBranches, setDepartments } from '../../slices/userSlice';
import store from '../../store';
import { createUser } from '../backendApi';
import moment from 'moment';

export const getTechs = async () => {
  const techProfile = collection(firestore, 'techs');

  try {
    const data = await getDocs(techProfile);
    let techs = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setUsers(techs));
  } catch (error) {
    console.error(error.message);
  }
};

export const signUpTech = async ({
  name,
  surname,
  position,
  email,
  cellphone,
  password,
  createdAt,
}) => {
  const techProfile = collection(firestore, 'techs');
  try {
    const res = await createUser({ email, password });
    const credentials = res.data;
    await addDoc(techProfile, {
      name,
      surname,
      email,
      cellphone,
      position,
      createdAt,
      credentials,
    });
    return true;
  } catch (error) {
    console.error('Error creating tech: ', error.message);
    return false;
  }
};

//Create a branch//
export const createITBranch = async ({ name, createdBy }) => {
  const branchRef = collection(firestore, 'main_branch');
  const createdAt = moment().format();
  const users = [];

  try {
    await addDoc(branchRef, {
      name,
      createdAt,
      users,
      createdBy,
    });
  } catch (error) {
    console.error('Error creating a branch: ', error);
  }
};

//Get main branches//
export const getITBranches = async () => {
  const branchRef = collection(firestore, 'main_branch');

  try {
    const data = await getDocs(branchRef);
    const branches = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setBranches(branches));
  } catch (error) {
    console.error('Error fetching branches: ', error);
  }
};

//Create a IT Departments//
export const createITDepartment = async ({ name, createdBy }) => {
  const depRef = collection(firestore, 'main_departments');
  const createdAt = moment().format();
  const users = [];
  try {
    await addDoc(depRef, {
      name,
      createdAt,
      users,
      createdBy,
    });
    console.log('alert success');
  } catch (error) {
    console.error(error.message);
  }
};

//Get main departments//
export const getITdepartments = async () => {
  const depRef = collection(firestore, 'main_departments');
  try {
    const data = await getDocs(depRef);
    const departments = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setDepartments(departments));
  } catch (error) {
    console.error('Error fetching departments: ', error);
  }
};
