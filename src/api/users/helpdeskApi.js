import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { firestore } from '../../firebse-config';
import store from '../../store';
import moment from 'moment';
import {
  sendTicketCreationNotification,
  sendTextNotification,
  ticketHasBeenClaimed,
  ticketHasBeenClosed,
} from './client-notifications';
import {
  setTickets,
  setClientTickets,
  setUserTickets,
  setTicket,
  setTexts,
  setPendingTickets,
  setClosedTickets,
  setUnAssignedTickets,
} from '../../slices/helpDeskSlice';

//Create a ticket for a user//
export const createTicketForUser = async ({
  header,
  howbad,
  desc,
  userId,
  username,
  clientId,
  createdAt,
  clientName,
  userClientId,
  createdBy,
  email,
}) => {
  const ticket = collection(firestore, 'client_tickets');
  const data = await getDocs(ticket);

  let tickets = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  const num = tickets.length + 1;
  const ticketNum = `CIT-00${num}`;
  let isComplete = false;
  let notified = false;
  let review = null;

  try {
    await addDoc(ticket, {
      username,
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
      review,
      userClientId,
    });

    const res = await sendTicketCreationNotification({
      email,
      username,
      header,
      userId,
    });
    if (res) {
      console.log('Notification sent successfully');
      return true;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error Creating Ticket: ', error);
  }
};

//Fetch client pending tickets//
export const fetchClientHelpdesk = async (clientId) => {
  const ticketsRef = collection(firestore, 'client_tickets');
  const q = query(
    ticketsRef,
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    let tickets = [];
    let complete = [];
    let incomplete = [];
    let unassigned = [];
    snapshot.docs.forEach((doc) => {
      tickets.push({ ...doc.data(), id: doc.id });
    });

    tickets.map((ticket) => {
      if (!ticket.assignedTo) unassigned.push(ticket);
      if (ticket.isComplete) {
        complete.push(ticket);
      } else {
        incomplete.push(ticket);
      }
    });
    store.dispatch(setPendingTickets(incomplete));
    store.dispatch(setClosedTickets(complete));
    store.dispatch(setUnAssignedTickets(unassigned));
    store.dispatch(setTickets(tickets));
  });
};

//Fetch your client tickets//
export const fetchClientTickets = async (userClientId) => {
  const ticketsRef = collection(firestore, 'client_tickets');
  const q = query(
    ticketsRef,
    where('userClientId', '==', userClientId),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    let tickets = [];
    snapshot.docs.forEach((doc) => {
      tickets.push({ ...doc.data(), id: doc.id });
    });

    console.log('Your Client Tickets', tickets);
    store.dispatch(setClientTickets(tickets));
  });
};

//Fetch Ticket//
export const fetchYourTicket = async (ticketId) => {
  const ticketRef = doc(firestore, 'client_tickets', ticketId);

  const ticketDoc = await getDoc(ticketRef);
  const ticket = ticketDoc.data();

  store.dispatch(setTicket(ticket));
};

//Fetch ticket texts//
export const fetchYourTicketTexts = (ticketId) => {
  const textsRef = collection(firestore, 'ticket_texts');
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
    console.log('Ticket Texts: ', texts);
    store.dispatch(setTexts(texts));
  });
  return unsub;
};

//Send a ticket texts//
export const sendTicketText = async ({
  text,
  authorId,
  authorName,
  ticketId,
  createdAt,
  to,
  replyTo,
}) => {
  const message = collection(firestore, 'ticket_texts');
  try {
    await addDoc(message, {
      text,
      authorId,
      authorName,
      ticketId,
      createdAt,
      replyTo,
    });

    const res = await sendTextNotification({ ticketId, to, text });
    if (res) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Error Sending Text: ', error);
    return false;
  }
};

//Claim a ticket//
export const claimClientTicket = async ({
  ticketId,
  userId,
  techName,
  email,
  username,
  clientUserId,
}) => {
  const ticketRef = doc(firestore, 'client_tickets', ticketId);
  const newFields = { assignedTo: { id: userId, name: techName } };
  try {
    await updateDoc(ticketRef, newFields);

    const res = await ticketHasBeenClaimed({
      email,
      username,
      clientUserId,
      ticketId,
    });

    if (res) {
      return 'success';
    } else {
      return 'failure';
    }
  } catch (error) {
    console.error('Error Claiming ticket: ', error);
    return 'failure';
  }
};

//Fetch user tickets//
export const fetchClientUserTickets = async (userId) => {
  const ticketsRef = collection(firestore, 'client_tickets');

  try {
    const q = query(
      ticketsRef,
      where('userId', '==', userId),
      orderBy('createdAt')
    );

    onSnapshot(q, (snapshot) => {
      let tickets = [];
      snapshot.docs.forEach((doc) => {
        tickets.push({ ...doc.data(), id: doc.id });
      });

      console.log('User Tickets: ', tickets);
      store.dispatch(setUserTickets(tickets));
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const closeTheTicket = async ({
  ticketId,
  email,
  ticketNum,
  username,
  userId,
}) => {
  const ticketRef = doc(firestore, 'client_tickets', ticketId);

  try {
    const newFields = { isComplete: true, completedAt: moment().format() };
    await updateDoc(ticketRef, newFields);

    const res = await ticketHasBeenClosed({
      email,
      username,
      ticketNum,
      userId,
      ticketId,
    });
    if (res) {
      return 'success';
    } else {
      return 'failure';
    }
  } catch (error) {
    console.error('Error closing ticket: ', error);
    return 'failure';
  }
};

//Delete Ticket//
export const deleteTheTicket = async ({ ticketId, userClientId }) => {
  try {
    await deleteDoc(doc(firestore, 'client_tickets', ticketId));
    console.log('Fetch the client user: ', userClientId);
  } catch (error) {
    console.error('Error Deleting Ticket: ', error);
  }
};
