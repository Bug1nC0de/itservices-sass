import { firestore } from '../../firebse-config';
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
  runTransaction,
  arrayUnion,
  arrayRemove,
  deleteField,
} from 'firebase/firestore';
import store from '../../store';
import moment from 'moment';
import {
  notifyUser,
  textNotification,
  ticketClaimed,
  closingTicketEmail,
} from '../backendApi';
import {
  setClientTickets,
  setUserTickets,
  setTicket,
  setTexts,
  setPendingTickets,
  setStillActive,
  setTimeOnTickets,
  setMostActiveClients,
  setClosedTickets,
  setUnAssignedTickets,
} from '../../slices/helpDeskSlice';
import { fetchYourTicket } from '../users/helpdeskApi';

//Most active clients//
export const mostActiveClients = async () => {
  try {
    const ticketRef = collection(firestore, 'tickets');
    const snapshot = await getDocs(ticketRef);

    const tickets = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Group by clientId and count tickets
    const activityMap = {};

    tickets.forEach((t) => {
      if (!activityMap[t.clientId]) {
        activityMap[t.clientId] = { clientName: t.clientName, count: 0 };
      }
      activityMap[t.clientId].count += 1;
    });

    // Convert to array and sort by count desc
    const sortedClients = Object.entries(activityMap)
      .map(([clientId, { clientName, count }]) => ({
        clientId,
        clientName,
        count,
      }))
      .sort((a, b) => b.count - a.count);
    store.dispatch(setMostActiveClients(sortedClients));
  } catch (error) {
    console.error('Error fetching most active clients:', error);
    return [];
  }
};

//Create ticket for user//
export const createUserTicket = async ({
  header,
  howbad,
  desc,
  userId,
  username,
  clientId,
  createdAt,
  clientName,
  createdBy,
  email,
}) => {
  const ticket = collection(firestore, 'tickets');
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
    });

    await notifyUser({ email, username, header, userId });
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch pending tickets//
export const fetchTickets = async () => {
  const ticketsRef = collection(firestore, 'tickets');
  const q = query(
    ticketsRef,
    where('isComplete', '==', false),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    let tickets = [];
    snapshot.docs.forEach((doc) => {
      tickets.push({ ...doc.data(), id: doc.id });
    });

    store.dispatch(setPendingTickets(tickets));
  });
};

//Fetch closed tickets/
export const fetchClosedTickets = async () => {
  const ticketsRef = collection(firestore, 'tickets');
  const q = query(
    ticketsRef,
    where('isComplete', '==', true),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    let tickets = [];
    snapshot.docs.forEach((doc) => {
      tickets.push({ ...doc.data(), id: doc.id });
    });

    store.dispatch(setClosedTickets(tickets));
  });
};

//Fetch unassigned tickets//
export const fetchUnAssigned = async () => {
  const ticketsRef = collection(firestore, 'tickets');
  const q = query(
    ticketsRef,
    where('assignedTo', '==', null),
    orderBy('createdAt')
  );

  onSnapshot(q, (snapshot) => {
    let tickets = [];
    snapshot.docs.forEach((doc) => {
      tickets.push({ ...doc.data(), id: doc.id });
    });

    store.dispatch(setUnAssignedTickets(tickets));
  });
};

//Fetch Client Tickets//
export const fetchClientTickets = async (clientId) => {
  try {
    const ticketRef = collection(firestore, 'tickets');
    const q = query(
      ticketRef,
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );
    onSnapshot(q, (snapshot) => {
      let tickets = [];
      snapshot.docs.forEach((doc) => {
        tickets.push({ ...doc.data(), id: doc.id });
      });
      store.dispatch(setClientTickets(tickets));
    });
  } catch (error) {
    console.error('Error Fetching Client Tickets: ', error.message);
  }
};

//Fetch a ticket//
export const fetchTicket = async (ticketId) => {
  const ticketRef = doc(firestore, 'tickets', ticketId);

  const ticketDoc = await getDoc(ticketRef);
  if (ticketDoc.exists) {
    const ticket = { id: ticketDoc.id, ...ticketDoc.data() };
    store.dispatch(setTicket(ticket));
  } else {
    fetchYourTicket(ticketId);
  }
};

//Fix texts structure//
export const fixTextStructure = async () => {
  const textsRef = collection(firestore, 'texts');
  try {
    const q = query(textsRef, orderBy('createdAt'));

    const snapshot = await getDocs(q);
    const promises = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      if (data.text.split('.').shift() === 'https://firebasestorage') {
        await updateDoc(docSnap.ref, {
          imgUrl: data.text,
          text: '',
        });
      }
    });
    await Promise.all(promises);
    console.log('Text structure fixed successfully');
  } catch (error) {
    console.error('Error Fixing texts: ', error);
  }
};

//Fetch and listen to ticket texts//
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
    store.dispatch(setTexts(texts));
  });
  return unsub;
};

//send a message//
export const sendText = async ({
  text,
  authorId,
  authorName,
  ticketId,
  createdAt,
  replyTo,
}) => {
  const message = collection(firestore, 'texts');

  try {
    await addDoc(message, {
      text,
      authorId,
      authorName,
      ticketId,
      createdAt,
      replyTo,
    });

    let to = 'user';

    await textNotification({ ticketId, to, text });

    //   dispatch({ type: CLEAR_UPLOAD });
  } catch (error) {
    console.error(error.message);
  }
};

//Text reaction//
export const reactToText = async ({ emoji, userId, textId }) => {
  if (!textId || !emoji || !userId) throw new Error('Missing params');

  const ref = doc(firestore, 'texts', textId);

  return runTransaction(firestore, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('Text not found');

    const data = snap.data() || {};
    const reactions = data.reactions || {};
    const current = Array.isArray(reactions[emoji]) ? reactions[emoji] : [];
    const hasReacted = current.includes(userId);

    // Build the predicted next state for optimistic UI return
    const nextSet = new Set(current);
    if (hasReacted) nextSet.delete(userId);
    else nextSet.add(userId);
    const nextArr = Array.from(nextSet);

    if (hasReacted) {
      // Remove my reaction; delete key if it would become empty
      if (current.length === 1) {
        tx.update(ref, {
          [`reactions.${emoji}`]: deleteField(),
          updatedAt: moment().format(),
        });
      } else {
        tx.update(ref, {
          [`reactions.${emoji}`]: arrayRemove(userId),
          updatedAt: moment().format(),
        });
      }
    } else {
      // Add my reaction (creates the array if missing)
      tx.update(ref, {
        [`reactions.${emoji}`]: arrayUnion(userId),
        updatedAt: moment().format(),
      });
    }

    // Return the next reactions map so caller can update UI immediately
    const nextReactions = { ...reactions };
    if (nextArr.length) nextReactions[emoji] = nextArr;
    else delete nextReactions[emoji];

    return nextReactions;
  });
};

//Delete text//
export const deleteText = async (textId) => {
  try {
    await deleteDoc(doc(firestore, 'texts', textId));
    return 'success';
  } catch (error) {
    console.log('Error deleting ticket: ', error);
    return 'failed';
  }
};

//Claim a ticket//
export const claimTicket = async ({
  ticketId,
  techId,
  techName,
  email,
  username,
  userId,
}) => {
  const ticketRef = doc(firestore, 'tickets', ticketId);

  const newFields = { assignedTo: { id: techId, name: techName } };

  try {
    await updateDoc(ticketRef, newFields);

    await ticketClaimed({ email, username, userId, ticketId });

    await fetchTicket(ticketId);
    await fetchTicketTexts(ticketId);
    return 'success';
  } catch (error) {
    console.error('Error claiming Ticket: ', error);
    return 'failure';
  }
};

//Fetch user tickets//
export const fetchUserTickets = async (userId) => {
  const ticketsRef = collection(firestore, 'tickets');

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
      store.dispatch(setUserTickets(tickets));
    });
  } catch (error) {
    console.error(error.message);
  }
};

//Close a ticket//
export const closeTicket = async ({
  ticketId,
  email,
  ticketNum,
  username,
  userId,
}) => {
  try {
    const ticketRef = doc(firestore, 'tickets', ticketId);
    const newFields = { isComplete: true, completedAt: moment().format() };
    await updateDoc(ticketRef, newFields);

    await closingTicketEmail({
      email,
      username,
      ticketNum,
      userId,
      ticketId,
    });
    //   dispatch(setAlert('You have successfully closed the ticket', 'success'));
    await fetchTicket(ticketId);
    await fetchTicketTexts(ticketId);
    return 'success';
  } catch (error) {
    console.error('Error closing Ticket: ', error.message);
    return 'failure';
  }
};

//Delete Ticket//
export const deleteTicket = async ({ ticketId, clientId }) => {
  try {
    await deleteDoc(doc(firestore, 'tickets', ticketId));
    //   dispatch(setAlert('Ticket has been successfully deleted', 'success'));
    await fetchClientTickets(clientId);
  } catch (error) {
    console.error('Error deleting ticket:', error);
    //   dispatch(setAlert('Something went wrong', 'error'));
  }
};

//Client Ticket report//
export const getClientTicketReport = async (clientId) => {
  const firstday = moment().date(1).format();
  try {
    const ticketsRef = collection(firestore, 'tickets');
    const q = query(
      ticketsRef,
      where('createdAt', '>=', firstday),
      where('clientId', '==', clientId),
      orderBy('createdAt')
    );

    onSnapshot(q, (snapshot) => {
      let tickets = [];
      snapshot.docs.forEach((doc) => {
        tickets.push({ ...doc.data(), id: doc.id });
      });

      const num = tickets.filter((ticket) => {
        return ticket.isComplete === false;
      });
      store.dispatch(setStillActive(num));
      store.dispatch(setClientTickets(tickets));
      //   dispatch({ type: STILL_ACTIVE, payload: num.length });
      //   dispatch({ type: CLIENT_TICKETS, payload: tickets });
    });
  } catch (error) {
    console.error(error.message);
  }
};

//calculate time on ticket//
export const calculateTimeOnTicket = async ({ client_tickets }) => {
  try {
    const hours = [];
    const minutes = [];
    client_tickets.forEach((ticket) => {
      function diff_minutes(d1, d2) {
        var diff = (d2.getTime() - d1.getTime()) / 1000;
        diff /= 60;

        if (diff < 60) {
          let time = Math.round(diff);
          minutes.push(time);
        } else if (diff > 60) {
          diff /= 60;
          let time = Math.round(diff);
          hours.push(time);
        }
      }

      let d1 = new Date(ticket.createdAt);
      let d2 = new Date(ticket.completedAt);

      diff_minutes(d1, d2);
    });

    const sumh = hours.reduce((index, value) => {
      return index + value;
    }, 0);

    const summ = minutes.reduce((index, value) => {
      return index + value;
    }, 0);

    const time = sumh + ':' + summ;
    store.dispatch(setTimeOnTickets(time));
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch custom ticket report//
export const customTicketReport = async ({ clientId, first, last }) => {
  try {
    const ticketRef = collection(firestore, 'tickets');
    const q = query(
      ticketRef,
      where('createdAt', '>=', first),
      where('clientId', '==', clientId),
      orderBy('createdAt')
    );

    onSnapshot(q, (snapshot) => {
      let tickets = [];
      snapshot.docs.forEach((doc) => {
        tickets.push({ ...doc.data(), id: doc.id });
      });

      const active = tickets.filter((ticket) => {
        return ticket.isComplete === false;
      });
      const loot = tickets.filter((ticket) => {
        return ticket.completedAt <= last;
      });

      //Calculate time spent on tickets//
      const hours = [];
      const minutes = [];
      loot.forEach((ticket) => {
        function diff_minutes(d1, d2) {
          var diff = (d2.getTime() - d1.getTime()) / 1000;
          diff /= 60;

          if (diff < 60) {
            let time = Math.round(diff);
            minutes.push(time);
          } else if (diff > 60) {
            diff /= 60;
            let time = Math.round(diff);
            hours.push(time);
          }
        }

        let d1 = new Date(ticket.createdAt);
        let d2 = new Date(ticket.completedAt);

        diff_minutes(d1, d2);
      });

      const sumh = hours.reduce((index, value) => {
        return index + value;
      }, 0);

      const summ = minutes.reduce((index, value) => {
        return index + value;
      }, 0);

      const time = sumh + ':' + summ;
      console.log({ time, loot, active });
      // dispatch({ type: TIME_ON_CUSTOM_TICKETS, payload: time });
      // dispatch({ type: CUSTOM_TICKET_RANGE, payload: loot });
      // dispatch({ type: CUSTOM_STILL_ACTIVE, payload: active.length });
    });
  } catch (error) {
    console.error(error.message);
  }
};

//Get tickets that need a review//
export const getunReviewTickets = async () => {
  try {
    const ticketRef = collection(firestore, 'tickets');
    const q = query(
      ticketRef,
      where('review', '==', null),
      where('isComplete', '==', true),
      orderBy('createdAt')
    );

    onSnapshot(q, (snapshot) => {
      let tickets = [];
      snapshot.docs.forEach((doc) => {
        tickets.push({ ...doc.data(), id: doc.id });
      });
      console.log('Tickets that need review: ', tickets);
      //   dispatch({ type: TICKETS_THAT_NEED_REVIEW, payload: tickets });
    });
  } catch (error) {
    console.error(error.message);
  }
};
