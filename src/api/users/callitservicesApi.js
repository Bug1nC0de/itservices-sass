import store from '../../store';
import {
  setITTickets,
  setITTicket,
  setTicketTexts,
  setITProjects,
  setITProject,
  setProjectTexts,
} from '../../slices/callitservicesSlice';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firestore } from '../../firebse-config';
import {
  ticketCreatedNotification,
  messageNotification,
  ticketClosedNotification,
} from '../backendApi';
import moment from 'moment';

//Fetch Tickets//
export const fetchTickets = async (userId) => {
  const ticketsRef = collection(firestore, 'tickets');

  const q = query(
    ticketsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    let tickets = [];
    snapshot.docs.forEach((doc) => {
      tickets.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch(setITTickets(tickets));
    // dispatch({ type: MY_TICKETS, payload: tickets });
  });
};

//create a ticket//
export const createTicket = async ({
  header,
  howbad,
  desc,
  userId,
  clientId,
  createdAt,
  clientName,
  createdBy,
  email,
  username,
}) => {
  const ticket = collection(firestore, 'tickets');
  const data = await getDocs(ticket);

  let tickets = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  const num = tickets.length + 1;
  const ticketNum = `CIT-00${num}`;

  let isComplete = false;
  let notified = false;
  let deviceToken = '';
  let review = null;

  try {
    const newTicket = await addDoc(ticket, {
      header,
      howbad,
      desc,
      userId,
      clientId,
      createdAt,
      isComplete,
      clientName,
      createdBy,
      email,
      ticketNum,
      notified,
      deviceToken,
      username,
      review,
    });
    const user = username;
    const ticketId = newTicket.id;
    await ticketCreatedNotification({ user, ticketId });
    return 'success';
  } catch (error) {
    console.error(error.message);
    return 'failed';
  }
};

//fetch a ticket//
export const fetchTicket = async (ticketId) => {
  const ticketRef = doc(firestore, 'tickets', ticketId);

  try {
    const ticket = await getDoc(ticketRef);
    const myTicket = ticket.data();

    store.dispatch(setITTicket(myTicket));
  } catch (error) {
    console.error('Error Fetching Ticket: ', error.message);
  }
};

//fetch ticket texts//
export const fetchTicketTexts = async (ticketId) => {
  const textsRef = collection(firestore, 'texts');

  const q = query(
    textsRef,
    where('ticketId', '==', ticketId),
    orderBy('createdAt')
  );

  const unsub = onSnapshot(q, (snapshot) => {
    let texts = [];
    snapshot.docs.forEach((doc) => {
      texts.push({ ...doc.data(), id: doc.id });
    });

    store.dispatch(setTicketTexts(texts));
    // dispatch({ type: TICKET_TEXTS, payload: texts });
  });
  return unsub;
};

//Send Ticket message//
export const sendTicketMsg = async ({
  text,
  authorId,
  authorName,
  ticketId,
  createdAt,
}) => {
  const message = collection(firestore, 'texts');
  try {
    await addDoc(message, {
      text,
      authorId,
      authorName,
      ticketId,
      createdAt,
    });

    let to = 'tech';

    await messageNotification({ ticketId, to, text });
    //   dispatch({ type: CLEAR_UPLOAD });
  } catch (error) {
    console.error(error.message);
  }
};

//Close Tikcet//
export const closeTicket = async ({ ticketId, user, email }) => {
  const ticketRef = doc(firestore, 'tickets', ticketId);
  const newFields = { isComplete: moment().format() };

  try {
    await updateDoc(ticketRef, newFields);
    await ticketClosedNotification({ ticketId, user, email });
    await fetchTicket(ticketId);
    await fetchTicketTexts(ticketId);
    return 'success';
  } catch (error) {
    console.error('Error closing ticket: ', error);
    return 'failed';
  }
};

//Fetch Projects//
export const fetchProjects = async (proId) => {
  const q = query(
    collection(firestore, 'projects'),
    where('proUser.id', '==', proId),
    orderBy('createdAt')
  );
  try {
    const jam = await getDocs(q);

    const projects = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setITProjects(projects));
  } catch (error) {
    console.error(error.message);
  }
};

//Get Project//
export const fetchProject = async (projectId) => {
  try {
    const projectRef = doc(firestore, 'projects', projectId);

    const project = await getDoc(projectRef);
    const theProject = project.data();
    store.dispatch(setITProject(theProject));
    // dispatch({ type: MY_PROJECT, payload: theProject });
  } catch (error) {
    console.error(error.message);
  }
};

//fetch project texts//
export const fetchProjectTexts = async (projectId) => {
  const textsRef = collection(firestore, 'project_texts');

  const q = query(
    textsRef,
    where('projectId', '==', projectId),
    orderBy('createdAt')
  );

  const unsub = onSnapshot(q, (snapshot) => {
    let texts = [];
    snapshot.docs.forEach((doc) => {
      texts.push({ ...doc.data(), id: doc.id });
    });

    store.dispatch(setProjectTexts(texts));
  });
  return unsub;
};

//send project texts//
export const sendProjectText = async ({
  text,
  authorId,
  authorName,
  projectId,
  createdAt,
}) => {
  const message = collection(firestore, 'project_texts');
  try {
    await addDoc(message, {
      text,
      authorId,
      authorName,
      projectId,
      createdAt,
    });

    let to = 'tech';

    await messageNotification({ projectId, to, text });
    //   dispatch({ type: CLEAR_UPLOAD });
  } catch (error) {
    console.error(error.message);
  }
};
