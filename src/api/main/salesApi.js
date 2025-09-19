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
} from 'firebase/firestore';
import { notifyCollab } from '../backendApi';
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
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
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
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
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

      //   dispatch({ type: GET_LEAD_QUOTE, payload: null });
      //   dispatch({ type: GET_LEAD_INVOICE, payload: null });
      store.dispatch(setLeads(pipeline));
      store.dispatch(setClosedLeads(closed));
    });
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
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
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
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
  } catch (error) {
    console.error(error.message);
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
    }

    //   dispatch({ type: LEAD_FILE_URL, payload: null });
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch Lead Texts//
export const fetchLeadText = async (leadId) => {
  const textsRef = collection(firestore, 'leadText');

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
  authorId,
  authorName,
  createdAt,
  text,
  leadId,
}) => {
  const textRef = collection(firestore, 'leadText');
  const leadRef = doc(firestore, 'leads', leadId);

  try {
    await addDoc(textRef, { authorId, authorName, createdAt, text, leadId });
    const lead = await getDoc(leadRef);
    const theLead = lead.data();
    const assignedTo = theLead.collab;
    const title = authorName;
    const createdBy = theLead.createdBy;
    const type = 'lead';
    const id = leadId;
    await notifyCollab({ assignedTo, title, text, createdBy, type, id });
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error.message);
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
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
  }
};

//Remove Review Contacts//
export const removeReview = () => {
  try {
    store.dispatch(setReviewContacts(null));
  } catch (error) {
    console.error(error.message);
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
    //   dispatch(setAlert('Contacts have been successfully saved...', 'success'));
  } catch (error) {
    console.error(error.message);
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
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
  }
};

//Add note to new lead//
export const updateNoteToNewLead = (arr) => {
  try {
    console.log('Dispatch: ', arr);
    // dispatch({ type: ADD_NOTE, payload: arr });
    store.dispatch(setLeadNotes(arr));
  } catch (error) {
    console.error(error.message);
  }
};

//Add Followup to new note//
export const updateFollowToNewNote = (followup) => {
  try {
    console.log('Dispatch: ', followup);
    // dispatch({ type: ADD_FOLLOW, payload: followup });
    store.dispatch(setLeadFollowUps(followup));
  } catch (error) {
    console.error(error.message);
  }
};

//Collab on lead//
export const updateCollab = (arr) => {
  console.log('Dispatch: ', arr);
  try {
    // dispatch({ type: ADD_COLLAB, payload: arr });
    store.dispatch(setCollabCachedAdd(arr));
  } catch (error) {
    console.error(error.message);
  }
};

//Remove from collab//
export const removeFromCollab = (arr) => {
  console.log('dispatch: ', arr);
  try {
    // dispatch({ type: REMOVE_COLLAB, payload: arr });
    store.dispatch(setCollabCachedRemove(arr));
  } catch (error) {
    console.error(error.message);
  }
};

//Add client to lead//
export const updateClientToLead = (client) => {
  try {
    store.dispatch(setClient(client));
    // dispatch({ type: ADD_CLIENT_TO_LEAD, payload: client });
  } catch (error) {
    console.error(error.message);
  }
};
