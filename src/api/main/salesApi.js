import { firestore } from '../../firebse-config';
import moment from 'moment';
import store from '../../store';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  where,
  getDocs,
  updateDoc,
  setDoc,
  runTransaction,
  deleteField,
  arrayRemove,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore';
import { notifyCollab } from './main-notifications';
import {
  setLeadNotes,
  setLeadFollowUps,
  setCollabCachedAdd,
  setCollabCachedRemove,
  setClosedLeads,
  setLeads,
  setCollabLeads,
  setLead,
  setQuote,
  setInvoice,
  setClient,
  setDone,
  setScheduled,
  setTexts,
  setMyContacts,
  setReviewContacts,
  setItems,
} from '../../slices/salesSlice';

//Create a lead//
export const createLead = async ({
  client,
  createdBy,
  createdAt,
  desc,
  collab,
  lead_notes,
  leadFollowUps,
  type,
}) => {
  const lead = collection(firestore, 'leads');
  const pipeline = true;
  const { name, email } = client;
  let stage = 'Recon';

  try {
    const result = await addDoc(lead, {
      name,
      email,
      client,
      pipeline,
      createdBy,
      createdAt,
      desc,
      collab,
      stage,
      type,
    });

    let leadId = result.id;
    if (lead_notes.length > 0) {
      ////Create the notes//
      for (const lnote of lead_notes) {
        await addLeadNote({ leadId, ...lnote });
      }
    }

    if (leadFollowUps.length > 0) {
      ///create Followups
      for (const followUp of leadFollowUps) {
        await createFollowUp({ leadId, ...followUp });
      }
    }

    const assignedTo = collab;
    const title = 'New Lead Created...';
    const text = desc;
    const id = leadId;
    await notifyCollab({
      assignedTo,
      title,
      text,
      createdBy,
      type: 'lead',
      id,
    });

    return leadId;
  } catch (error) {
    console.error(error.message);
  }
};

//Add a lead note//
export const addLeadNote = async ({ leadId, note, createdAt, createdBy }) => {
  const noteRef = collection(firestore, 'leadNotes');
  const leadRef = doc(firestore, 'leads', leadId);
  const lead = await getDoc(leadRef);
  const theLead = lead.data();

  const assignedTo = theLead.collab;

  try {
    await addDoc(noteRef, {
      note,
      leadId,
      createdAt,
      createdBy,
    });
    const title = 'New lead note added...';
    const text = note;
    const type = 'lead';
    const id = leadId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await getLeadNotes(leadId);
    return 'success';
  } catch (error) {
    console.error(error.message);
    return 'failed';
  }
};

//Get Lead Notes//
export const getLeadNotes = async (leadId) => {
  const noteRef = collection(firestore, 'leadNotes');
  const q = query(noteRef, where('leadId', '==', leadId), orderBy('createdAt'));
  try {
    const jam = await getDocs(q);
    const notes = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setLeadNotes(notes));
  } catch (error) {
    console.error('Error geting lead notes: ', error.message);
  }
};

//Create lead follow up//
export const createFollowUp = async ({
  leadId,
  note,
  createdAt,
  date,
  createdBy,
}) => {
  const followUpRef = collection(firestore, 'followUps');
  const leadRef = doc(firestore, 'leads', leadId);
  const lead = await getDoc(leadRef);
  const theLead = lead.data();
  let complete = false;
  try {
    await addDoc(followUpRef, {
      leadId,
      note,
      createdAt,
      date,
      createdBy,
      complete,
    });

    const assignedTo = theLead.collab;
    const title = 'Follow up created';
    const text = note;
    const type = 'lead';
    const id = leadId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await getFollowUps(leadId);
    return 'success';
  } catch (error) {
    console.error('Error creating follow up', error.message);
    return 'failed';
  }
};

//Get follow ups//
export const getFollowUps = async (leadId) => {
  const followUpRef = collection(firestore, 'followUps');
  try {
    const q = query(
      followUpRef,
      where('leadId', '==', leadId),
      where('complete', '==', false),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);
    const follows = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setLeadFollowUps(follows));
  } catch (error) {
    console.error('Error getting follow ups', error.message);
  }
};

//Fetch my leads//
export const fetchMyLeads = async (id) => {
  //   dispatch({ type: CLEAR_LEADS });

  const leadsRef = collection(firestore, 'leads');
  try {
    const q = query(
      leadsRef,
      where('createdBy.id', '==', id),
      orderBy('createdAt')
    );
    onSnapshot(q, (snapshot) => {
      let leads = [];
      snapshot.docs.forEach((doc) => {
        leads.push({ ...doc.data(), id: doc.id });
      });

      const pipeline = leads.filter((lead) => {
        return lead.pipeline === true;
      });

      const closed = leads.filter((lead) => {
        return lead.pipeline === false;
      });

      store.dispatch(setLeads(pipeline));
      store.dispatch(setClosedLeads(closed));
    });
  } catch (error) {
    console.error('Error fetching leads: ', error.message);
  }
};

//Get Collab Leads//
export const getCollabLeads = async (id) => {
  const leadsRef = collection(firestore, 'leads');
  try {
    const q = query(leadsRef, orderBy('createdAt'));
    onSnapshot(q, (snapshot) => {
      let leads = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.collab && data.collab.some((user) => user.id === id)) {
          leads.push({ ...data, id: doc.id });
        }
      });
      store.dispatch(setCollabLeads(leads));
    });
  } catch (error) {
    console.error('Error fetching collab leads: ', error.message);
  }
};

//Get Lead//
export const getLead = async (leadId) => {
  //   dispatch({ type: CLEAR_LEADS });
  const leadRef = doc(firestore, 'leads', leadId);
  try {
    const lead = await getDoc(leadRef);
    const theLead = lead.data();
    store.dispatch(setLead(theLead));
  } catch (error) {
    console.error('Error fetching lead: ', error.message);
  }
};

//Get Lead Quote//
export const getLeadQuote = async (leadId) => {
  //   dispatch({ type: GET_LEAD_QUOTE, payload: null });
  try {
    const q = query(
      collection(firestore, 'quotes'),
      where('leadId', '==', leadId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const quote = { id: doc.id, ...doc.data() };
      store.dispatch(setQuote(quote));
    }
  } catch (error) {
    console.error('Error fetching quote:', error.message);
  }
};

//Get Lead Invoice//
export const getLeadInvoice = async (leadId) => {
  //   dispatch({ type: GET_LEAD_INVOICE, payload: null });
  try {
    const q = query(
      collection(firestore, 'invoices'),
      where('leadId', '==', leadId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const invoice = { id: doc.id, ...doc.data() };
      store.dispatch(setInvoice(invoice));
    }
  } catch (error) {
    console.error('Error fetching invoice:', error.message);
    // dispatch(setAlert('Failed to load invoice', 'error'));
  }
};

//Complete a follow up//
export const followUpDone = async ({ leadId, fid }) => {
  const followUpRef = doc(firestore, 'followUps', fid);
  const leadRef = doc(firestore, 'leads', leadId);
  const lead = await getDoc(leadRef);
  const theLead = lead.data();
  const name = theLead.name;
  try {
    const complete = true;
    const completedAt = moment().format();
    const newFields = { complete, completedAt };
    await updateDoc(followUpRef, newFields);

    const assignedTo = theLead.collab;
    const createdBy = theLead.createdBy;
    const title = 'Well done on following up!';
    const text = `Lead name: ${name}`;
    const type = 'lead';
    const id = leadId;

    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await getFollowUps(leadId);
    await getDoneFollowUps(leadId);
    return 'success';
  } catch (error) {
    console.error('Error completing follow up: ', error.message);
    return 'failed';
  }
};

//Get completed follow ups//
export const getDoneFollowUps = async (leadId) => {
  const followUpRef = collection(firestore, 'followUps');
  try {
    const q = query(
      followUpRef,
      where('leadId', '==', leadId),
      where('complete', '==', true),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);
    const done = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setDone(done));
  } catch (error) {
    console.error('Error getting done follow ups', error.message);
  }
};

//Get Scheduled Follow Ups//
export const getScheduledFollowUps = async (id) => {
  const followUpRef = collection(firestore, 'followUps');
  try {
    const q = query(
      followUpRef,
      where('complete', '==', false),
      where('createdBy.id', '==', id),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);
    const followUp = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setScheduled(followUp));
  } catch (error) {
    console.error('Error getting scheduled follow ups:', error.message);
  }
};

//Change Lead Stage//
export const changeLeadStage = async ({ newStage, leadId }) => {
  const leadRef = doc(firestore, 'leads', leadId);
  const lead = await getDoc(leadRef);
  const theLead = lead.data();
  try {
    const newFields = { stage: newStage };
    await updateDoc(leadRef, newFields);

    const name = theLead.name;
    const assignedTo = theLead.collab;
    const title = `New lead stage: ${newStage}`;
    const text = name;
    const createdBy = theLead.createdBy;
    const type = 'lead';
    const id = leadId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await getLead(leadId);
    return 'success';
  } catch (error) {
    console.error('Error changing lead stage: ', error.message);
    return 'failed';
  }
};

//Update Lead File//
export const updateLeadFile = async ({ type, url, leadId }) => {
  try {
    const leadRef = doc(firestore, 'leads', leadId);
    const lead = await getDoc(leadRef);
    const theLead = lead.data();
    const name = theLead.name;
    const id = leadId;

    if (type === 'lead_quote') {
      //quote
      const newFields = { quote: url };
      await updateDoc(leadRef, newFields);

      const assignedTo = theLead.collab;

      const title = 'Lead qoute has been uploaded';
      const text = `Lead Name: ${name}`;
      const createdBy = theLead.createdBy;

      await notifyCollab({
        assignedTo,
        title,
        text,
        createdBy,
        type: 'lead',
        id,
      });
      await getLead(leadId);
      return 'success';
    } else if (type === 'lead_pitch') {
      //pitch
      const newFields = { pitch: url };
      await updateDoc(leadRef, newFields);
      const assignedTo = theLead.collab;

      const title = 'Lead pitch has been uploaded';
      const text = `Lead Name: ${name}`;
      const createdBy = theLead.createdBy;

      await notifyCollab({
        assignedTo,
        title,
        text,
        createdBy,
        type: 'lead',
        id,
      });
      await getLead(leadId);
      return 'success';
    } else if (type === 'lead_invoice') {
      //invoice
      const newFields = { invoice: url };
      await updateDoc(leadRef, newFields);
      const assignedTo = theLead.collab;

      const title = 'Lead invoice has been uploaded';
      const text = `Lead Name: ${name}`;
      const createdBy = theLead.createdBy;

      await notifyCollab({
        assignedTo,
        title,
        text,
        createdBy,
        type: 'lead',
        id,
      });
      await getLead(leadId);
      return 'success';
    }
  } catch (error) {
    console.error(error.message);
    return 'failed';
  }
};

//Fetch Lead Texts//
export const fetchLeadText = async (leadId) => {
  const textsRef = collection(firestore, 'lead_texts');

  const q = query(
    textsRef,
    where('leadId', '==', leadId),
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

//Send lead text//
export const sendLeadText = async ({
  text,
  imgUrl,
  authorId,
  authorName,
  leadId,
  createdAt,
  replyTo,
}) => {
  const textRef = collection(firestore, 'lead_texts');
  const leadRef = doc(firestore, 'leads', leadId);

  try {
    await addDoc(textRef, {
      authorId,
      authorName,
      createdAt,
      text,
      leadId,
      imgUrl,
      replyTo,
    });
    const lead = await getDoc(leadRef);
    const theLead = lead.data();
    const assignedTo = theLead.collab;
    const title = authorName;
    const createdBy = theLead.createdBy;
    const type = 'lead';
    const id = leadId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
  } catch (error) {
    console.error('Error Sending lead text: ', error);
  }
};

//Text reaction//
export const reactToText = async ({ emoji, userId, textId }) => {
  if (!textId || !emoji || !userId) throw new Error('Missing params');

  const ref = doc(firestore, 'lead_texts', textId);

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
    await deleteDoc(doc(firestore, 'lead_texts', textId));
    return 'success';
  } catch (error) {
    console.log('Error deleting ticket: ', error);
    return 'failed';
  }
};

//Lead to client//
export const leadToClient = async ({
  leadId,
  name,
  email,
  number,
  address,
  createdAt,
}) => {
  const leadRef = doc(firestore, 'leads', leadId);
  const clientRef = collection(firestore, 'clients');
  const lead = await getDoc(leadRef);
  const theLead = lead.data();
  const leadName = theLead.name;

  try {
    const pipeline = false;
    const newFields = { pipeline };
    await updateDoc(leadRef, newFields);
    await setDoc(doc(clientRef, leadId), {
      name,
      email,
      number,
      address,
      createdAt,
    });
    const assignedTo = theLead.collab;
    const title = 'We have new CLIENT!!';
    const text = `New client from lead:${leadName}`;
    const createdBy = theLead.createdBy;
    const type = 'lead';
    const id = leadId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    await getLead(leadId);
    return 'success';
  } catch (error) {
    console.error('Error turning lead to client: ', error.message);
    return 'failed';
  }
};

export const createContact = async ({
  name,
  lastName,
  email,
  mobile,
  tel,
  address,
  company,
  techId,
}) => {
  const contactRef = collection(firestore, 'contacts');
  try {
    let createdBy = techId;
    let createdAt = moment().format();

    await addDoc(contactRef, {
      name,
      lastName,
      email,
      mobile,
      tel,
      address,
      company,
      createdBy,
      createdAt,
    });
    //   dispatch(setAlert('Contact successfully added...', 'success'));
    await fetchContacts(techId);
    return 'success';
  } catch (error) {
    console.error('Error creating contact', error.message);
    return 'failed';
  }
};

//Fetch Contacts//
export const fetchContacts = async (techId) => {
  const contactRef = collection(firestore, 'contacts');
  try {
    const q = query(
      contactRef,
      where('createdBy', '==', techId),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);
    const contacts = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setMyContacts(contacts));
  } catch (error) {
    console.error('Error fetching contacts: ', error.message);
  }
};

//Review the contacts//
export const reviewMyContacts = ({ contacts }) => {
  try {
    //   dispatch(
    //     setAlert('Your contacts are imported, you may know review', 'success')
    //   );
    store.dispatch(setReviewContacts(contacts));
  } catch (error) {
    console.error('Error reviewing contacts: ', error.message);
  }
};

//Remove Review Contacts//
export const removeReview = () => {
  try {
    store.dispatch(setReviewContacts(null));
  } catch (error) {
    console.error('Error removing review', error.message);
  }
};

//Save imported contacts//
export const saveImportedContacts = async ({ contacts, techId }) => {
  const contactRef = collection(firestore, 'contacts');
  try {
    let createdBy = techId;
    let createdAt = moment().format();
    for (const contact of contacts) {
      await addDoc(contactRef, {
        name: contact.name,
        lastName: contact.lastName,
        email: contact.email,
        mobile: contact.mobile,
        tel: contact.tel,
        address: contact.address,
        company: contact.company,
        createdBy,
        createdAt,
      });
    }
    return 'success';
  } catch (error) {
    console.error('Error saving contacts: ', error.message);
    return 'failed';
  }
};

//Add Product Or Service//
export const addServiceOrProduct = async ({ techId, price, name, type }) => {
  const sellingRef = collection(firestore, 'selling');
  let createdBy = techId;
  let createdAt = moment().format();

  try {
    await addDoc(sellingRef, {
      name,
      price,
      type,
      createdBy,
      createdAt,
    });
    //   dispatch('Item added successfully', 'success');
    await fetchItems();
    return 'success';
  } catch (error) {
    console.error('Error adding service or product: ', error.message);
    return 'failed';
  }
};

//Fetch Items we selling//
export const fetchItems = async () => {
  const sellingRef = collection(firestore, 'selling');

  try {
    const q = query(sellingRef, orderBy('createdAt'));

    const jam = await getDocs(q);
    const items = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    store.dispatch(setItems(items));
  } catch (error) {
    console.error('Error fetching items: ', error.message);
  }
};

//Add note to new lead//
export const updateNoteToNewLead = (arr) => {
  try {
    store.dispatch(setLeadNotes(arr));
    return 'success';
  } catch (error) {
    console.error('Error adding note: ', error.message);
    return 'failed';
  }
};

//Add Followup to new note//
export const updateFollowToNewNote = (followup) => {
  try {
    // dispatch({ type: ADD_FOLLOW, payload: followup });
    store.dispatch(setLeadFollowUps(followup));
    return 'success';
  } catch (error) {
    console.error('Error adding following up: ', error.message);
    return 'failed';
  }
};

//Collab on lead//
export const updateCollab = (arr) => {
  try {
    // dispatch({ type: ADD_COLLAB, payload: arr });
    store.dispatch(setCollabCachedAdd(arr));
    return 'success';
  } catch (error) {
    console.error('Error updating collab: ', error.message);
    return 'failed';
  }
};

//Remove from collab//
export const removeFromCollab = (arr) => {
  try {
    // dispatch({ type: REMOVE_COLLAB, payload: arr });
    store.dispatch(setCollabCachedRemove(arr));
    return 'success';
  } catch (error) {
    console.error('Error removing collab', error.message);
    return 'failed';
  }
};

//Update Collaboration//
export const theCollab = async ({ myArr, leadId }) => {
  const leadRef = doc(firestore, 'leads', leadId);
  const leadDoc = await getDoc(leadRef);
  const lead = leadDoc.data();
  try {
    const newFields = { collab: myArr };
    await updateDoc(leadRef, newFields);
    await getLead(leadId);
    const assignedTo = lead.collab;
    const createdBy = lead.createdBy;
    const title = 'Lead Collob update...';
    const text = lead.name;
    const type = 'leads';
    const id = leadId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
    return 'success';
  } catch (error) {
    console.error(error.message);
    return 'failed';
  }
};

//Add client to lead//
export const updateClientToLead = (client) => {
  try {
    store.dispatch(setClient(client));
    return 'success';
    // dispatch({ type: ADD_CLIENT_TO_LEAD, payload: client });
  } catch (error) {
    console.error('Error adding client: ', error.message);
    return 'failed';
  }
};
