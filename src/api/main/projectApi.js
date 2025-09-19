import {
  addDoc,
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import moment from 'moment';
import { firestore } from '../../firebse-config';
import store from '../../store';
import {
  setProjects,
  setClientProjects,
  setProject,
  setProjectNext,
  setProjectMileStone,
  setFeature,
  setTexts,
} from '../../slices/projectSlice';
import { notifyCollab } from '../backendApi';

//Get Projects//
export const getProjects = () => {
  //   dispatch({ type: CLEAR_PROJECTS });
  const projectRef = collection(firestore, 'projects');
  const q = query(projectRef, where('complete', '==', false));
  onSnapshot(q, (snapshot) => {
    let projects = [];
    snapshot.docs.forEach((doc) => {
      projects.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch(setProjects(projects));
  });
};

//Get Client Projects//
export const clientProjects = (clientId) => {
  try {
    // dispatch({ type: CLEAR_PROJECTS });
    const projectRef = collection(firestore, 'projects');
    const q = query(
      projectRef,
      where('clientId', '==', clientId),
      orderBy('createdAt')
    );
    onSnapshot(q, (snapshot) => {
      let projects = [];
      snapshot.docs.forEach((doc) => {
        projects.push({ ...doc.data(), id: doc.id });
      });
      store.dispatch(setClientProjects(projects));
    });
  } catch (error) {
    console.error(error.message);
  }
};

//Create Projects//
export const createProject = async ({
  name,
  desc,
  value,
  clientId,
  createdAt,
  clientName,
  complete,
  proUser,
  createdBy,
}) => {
  const project = collection(firestore, 'projects');
  const completedAt = '';

  try {
    await addDoc(project, {
      name,
      desc,
      value,
      clientId,
      createdAt,
      completedAt,
      clientName,
      complete,
      proUser,
      createdBy,
    });

    //   dispatch(setAlert('Project Created Successfully', 'success'));
    clientProjects(clientId);
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch Project//
export const getProject = async (projectId) => {
  try {
    const projectRef = doc(firestore, 'projects', projectId);
    const project = await getDoc(projectRef);
    const theProject = project.data();
    store.dispatch(setProject(theProject));
  } catch (error) {
    console.error(error.message);
  }
};

//Assign Project Users//
export const assignUser = async ({ projectId, proUser }) => {
  try {
    const projectRef = doc(firestore, 'projects', projectId);
    const project = await getDoc(projectRef);
    const theProject = project.data();
    const newFields = { proUser };

    await updateDoc(projectRef, newFields);

    const assignedTo = proUser;
    const title = 'A new project with Call IT Services';
    const text = theProject.name;
    const createdBy = theProject.createdBy;
    const type = 'project';
    const id = projectId;

    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await getProject(projectId);
  } catch (error) {
    console.error(error.message);
  }
};

//Find all project next//
export const fetchProjectNext = async (projectId) => {
  console.log('Next: ', projectId);
  const q = query(
    collection(firestore, 'next'),
    where('projectId', '==', projectId),
    orderBy('createdAt')
  );

  try {
    const jam = await getDocs(q);
    const next = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setProjectNext(next));
  } catch (error) {
    console.error(error.message);
  }
};

//Find all project milestones//
export const fetchProjectMilestones = async (projectId) => {
  const mileRef = collection(firestore, 'milestone');
  try {
    const q = query(
      mileRef,
      where('projectId', '==', projectId),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);

    const milestones = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setProjectMileStone(milestones));
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch Feature Request//
export const fetchFeatureReq = async (projectId) => {
  try {
    const q = query(
      collection(firestore, 'feature'),
      where('projectId', '==', projectId),
      orderBy('createdAt')
    );

    const jam = await getDocs(q);
    const feature = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setFeature(feature));
  } catch (error) {
    console.error(error.message);
  }
};

//Accept Feature Request//
export const acceptRequest = async ({
  projectId,
  text,
  createdAt,
  featureId,
}) => {
  try {
    const featureRef = doc(firestore, 'feature', featureId);
    const projectRef = doc(firestore, 'projects', projectId);
    const project = await getDoc(projectRef);
    const theProject = project.data();
    const newFields = { accepted: true };

    await updateDoc(featureRef, newFields);
    const assignedTo = theProject.proUser;
    const createdBy = theProject.createdBy;
    const title = 'Feature request accepted';
    const type = 'project';
    const id = projectId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await addNext({ projectId, text, createdAt });
    await fetchFeatureReq(projectId);
  } catch (error) {
    console.error(error.mesage);
  }
};

//Add whats next//
export const addNext = async ({ text, projectId, createdAt }) => {
  try {
    const nextRef = collection(firestore, 'next');
    const projectRef = doc(firestore, 'projects', projectId);
    const project = await getDoc(projectRef);
    const theProject = project.data();
    const completedAt = null;
    const howLong = '1 week';
    const guessEnd = '';
    const start = '';
    const assigned = null;
    await addDoc(nextRef, {
      text,
      projectId,
      createdAt,
      completedAt,
      assigned,
      howLong,
      guessEnd,
      start,
    });

    const assignedTo = theProject.proUser;
    const title = 'We know whats next';
    const createdBy = theProject.createdBy;
    const type = 'project';
    const id = projectId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });

    await fetchProjectNext(projectId);
  } catch (error) {
    console.error(error.message);
  }
};

//Update Next//
export const upDateNext = async ({
  id,
  start,
  guessEnd,
  howLong,
  assigned,
  projectId,
}) => {
  const nextRef = doc(firestore, 'next', id);
  try {
    const newFields = { start, guessEnd, howLong, assigned };
    await updateDoc(nextRef, newFields);

    const assignedTo = assigned;
    const title = 'Project next updated';
    const text = `${assigned.name}: Assigned project task...`;
    const createdBy = '';
    const type = 'project';
    const id = projectId;

    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await fetchProjectNext(projectId);
  } catch (error) {
    console.error(error.message);
  }
};

//Complete Next//
export const completeNext = async ({
  id,
  completedAt,
  text,
  projectId,
  start,
  guessEnd,
  assigned,
}) => {
  const nextRef = doc(firestore, 'next', id);
  const mileRef = collection(firestore, 'milestone');
  const projectRef = doc(firestore, 'projects', projectId);
  const project = await getDoc(projectRef);
  const theProject = project.data();

  const newFields = { completedAt };
  await updateDoc(nextRef, newFields);
  let createdAt = completedAt;
  await addDoc(mileRef, {
    text,
    projectId,
    createdAt,
    start,
    guessEnd,
    assigned,
  });

  const assignedTo = theProject.proUser;
  const title = 'We reached a new milestone';
  const createdBy = theProject.createdBy;
  const type = 'project';

  await notifyCollab({
    assignedTo,
    title,
    text,
    createdBy,
    type,
    id: projectId,
  });

  await fetchProjectMilestones(projectId);
  await fetchProjectNext(projectId);
};

//Complete Project//
export const projectDone = async (projectId) => {
  const projectRef = doc(firestore, 'projects', projectId);
  const project = await getDoc(projectRef);
  const theProject = project.data();
  try {
    const newFields = { completedAt: moment().format(), complete: true };
    await updateDoc(projectRef, newFields);

    const assignedTo = theProject.proUser;
    const title = 'Project is complete';
    const text = `${theProject.name}; is complete`;
    const createdBy = theProject.createdBy;
    const type = 'project';
    const id = projectId;

    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await getProject(projectId);
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch project texts//
export const fetchProjectTexts = (projectId) => {
  const textRef = collection(firestore, 'projectTexts');
  const q = query(
    textRef,
    where('projectId', '==', projectId),
    orderBy('createdAt')
  );

  const unsub = onSnapshot(q, (snapshot) => {
    let texts = [];
    snapshot.docs.forEach((doc) => {
      texts.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch(setTexts(texts));
  });
  return unsub;
};

//Delete Profect//
export const deleteProject = async ({ projectId, clientId }) => {
  try {
    await deleteDoc(doc(firestore, 'projects', projectId));
    //   dispatch(setAlert('Project has been deleted successfully', 'success'));
    clientProjects(clientId);
  } catch (error) {
    console.error('Error Deleting Project: ', error);
    //   dispatch(setAlert('Something went wrong... try again.', 'error'));
  }
};
