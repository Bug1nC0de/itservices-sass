import { firestore } from '../../firebse-config';
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
import moment from 'moment';
import { sendCollabNotification } from '../backendApi';
import store from '../../store';
import {
  setClosedLeads,
  setCollabCachedAdd,
  setCollabCachedRemove,
  setCollabLeads,
  setDone,
  setFollow,
  setInvoice,
  setLead,
  setLeadFileUrl,
  setLeadFollowUps,
  setLeadNotes,
  setLeads,
  setNotes,
  setQuote,
  setScheduled,
  setTexts,
} from '../../slices/salesSlice';

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

//Create a lead//
export const createClientLead = async ({
  client,
  createdBy,
  createdAt,
  desc,
  collab,
  lead_notes,
  leadFollowUps,
  type,
}) => {
  const lead = collection(firestore, 'client_leads');
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
    return true;
  } catch (error) {
    console.error('Error Creating a lead: ', error);
    return false;
  }
};

export const addLeadNote = async ({ leadId, note, createdAt, createdBy }) => {
  const noteRef = collection(firestore, 'client_lead_notes');
  const leadRef = doc(firestore, 'client_leads', leadId);
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

    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });
  } catch (error) {
    console.error('Error creating lead note: ', error);
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
  const followUpRef = collection(firestore, 'client_lead_followup');
  const leadRef = doc(firestore, 'client_leads', leadId);
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

    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });
  } catch (error) {
    console.error('Error Creating lead follow up: ', error);
  }
};

//Fetch client leads//
export const fetchClientLeads = async (id) => {
  const leadsRef = collection(firestore, 'client_leads');

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
    console.log('Error Fetching Leads: ', error);
  }
};

//Fetch client collab leads//
export const fetchClientCollabLeads = async (id) => {
  const leadsRef = collection(firestore, 'client_leads');
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

//Fetch a leads//
export const fetchClientLead = async (leadId) => {
  const leadRef = doc(firestore, 'leads', leadId);
  try {
    const lead = await getDoc(leadRef);
    const theLead = lead.data();

    store.dispatch(setLead(theLead));
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch lead quote//
export const fetchLeadQuote = async (leadId) => {
  try {
    const q = query(
      collection(firestore, 'client_quotes'),
      where('leadId', '==', leadId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      store.dispatch(setQuote(doc));
    }
  } catch (error) {
    console.error('Error fetching quote:', error.message);
  }
};

//Fetch lead invoice//
export const fetchLeadInvoice = async (leadId) => {
  //  dispatch({ type: GET_LEAD_INVOICE, payload: null });
  try {
    const q = query(
      collection(firestore, 'client_invoices'),
      where('leadId', '==', leadId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      console.log('Dispatch lead invoice: ', doc);
      store.dispatch(setInvoice(doc));
      //   dispatch({
      //     type: GET_LEAD_INVOICE,
      //     payload: { id: doc.id, ...doc.data() },
      //   });
    }
  } catch (error) {
    console.error('Error fetching invoice:', error.message);
    // dispatch(setAlert('Failed to load invoice', 'error'));
  }
};

//Fetch Lead Notes//
export const fetchLeadNotes = async (leadId) => {
  const noteRef = collection(firestore, 'client_lead_notes');
  const q = query(noteRef, where('leadId', '==', leadId), orderBy('createdAt'));
  try {
    const jam = await getDocs(q);
    const notes = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    console.log('Dispatch Lead Notes: ', notes);
    store.dispatch(setNotes(notes));
    // dispatch({ type: LEAD_NOTES, payload: notes });
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch Lead follow ups//
export const fetchLeadFollowUps = async (leadId) => {
  const followUpRef = collection(firestore, 'client_lead_followup');
  try {
    const q = query(
      followUpRef,
      where('leadId', '==', leadId),
      where('complete', '==', false),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);
    const follows = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log('dispatch lead follow ups: ', follows);
    store.dispatch(setFollow(follows));
    // dispatch({ type: FOLLOW_UPS, payload: follows });
  } catch (error) {
    console.error(error.message);
  }
};

//Complete a follow up//
export const completeFollowUp = async ({ leadId, fid }) => {
  const followUpRef = doc(firestore, 'client_lead_followup', fid);
  const leadRef = doc(firestore, 'client_leads', leadId);
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

    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });

    console.log('Get Followups');
    await fetchLeadFollowUps(leadId);
    await fetchCompleteFollowUps(leadId);
    //   dispatch(getFollowUps(leadId));
    //   dispatch(getDoneFollowUps(leadId));
  } catch (error) {
    console.error(error.message);
  }
};

//Get one follow ups/
export const fetchCompleteFollowUps = async (leadId) => {
  const followUpRef = collection(firestore, 'client_lead_followup');
  try {
    const q = query(
      followUpRef,
      where('leadId', '==', leadId),
      where('complete', '==', true),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);
    const done = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log('Dispatch done follow ups: ', done);
    store.dispatch(setDone(done));
    // dispatch({ type: DONE_FOLLOW_UPS, payload: done });
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch scheduled followups//
export const fetchUpComingFollowups = async (id) => {
  const followUpRef = collection(firestore, 'client_lead_followup');
  try {
    const q = query(
      followUpRef,
      where('complete', '==', false),
      where('createdBy.id', '==', id),
      orderBy('createdAt')
    );
    const jam = await getDocs(q);
    const followUp = jam.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log('Dispatch upcoming follow ups: ', followUp);
    store.dispatch(setScheduled(followUp));
    // dispatch({ type: SCHEDULED_FOLLOWS, payload: followUp });
  } catch (error) {
    console.error(error.message);
  }
};

//Fetch Lead Texts//
export const fetchLeadTexts = async (leadId) => {
  const textsRef = collection(firestore, 'client_lead_text');

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
    console.log('Dispatch the texts: ', texts);
    store.dispatch(setTexts(texts));
    // dispatch({ type: GET_LEAD_TEXTS, payload: texts });
  });
  return unsub;
};

//Send a lead text//
export const sendClientLeadText = async ({
  authorId,
  authorName,
  createdAt,
  text,
  leadId,
}) => {
  const textRef = collection(firestore, 'client_lead_text');
  const leadRef = doc(firestore, 'client_leads', leadId);

  try {
    await addDoc(textRef, { authorId, authorName, createdAt, text, leadId });
    const lead = await getDoc(leadRef);
    const theLead = lead.data();
    const assignedTo = theLead.collab;
    const title = authorName;
    const createdBy = theLead.createdBy;
    const type = 'lead';
    const id = leadId;

    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });
  } catch (error) {
    console.error('Error Sending msg: ', error);
  }
};

//Update leads colloboration//
export const updateLeadCollaboration = async ({ arr, leadId }) => {
  //   dispatch(updateCollab([]));
  // dispatch(removeFromCollab([]));
  const leadRef = doc(firestore, 'client_leads', leadId);
  const lead = await getDoc(leadRef);
  const theLead = lead.data();
  const newFields = { collab: arr };
  await updateDoc(leadRef, newFields);

  const assignedTo = arr;
  const text = 'Lead collab updated...';
  const title = theLead.name;
  const createdBy = theLead.createdBy;
  const type = 'lead';
  const id = leadId;

  await sendCollabNotification({
    assignedTo,
    title,
    text,
    createdBy,
    type,
    id,
  });
  console.log('The the lead');
  await fetchClientLead(leadId);
  // dispatch(getLead(leadId));
};

//Update lead docs//
export const updateLeadDoc = async ({ type, url, leadId }) => {
  const leadRef = doc(firestore, 'client_leads', leadId);
  const lead = await getDoc(leadRef);
  const theLead = lead.data();
  const name = theLead.name;
  const id = leadId;
  try {
    if (type === 'lead_quote') {
      //quote
      const newFields = { quote: url };
      await updateDoc(leadRef, newFields);

      const assignedTo = theLead.collab;

      const title = 'Lead qoute has been uploaded';
      const text = `Lead Name: ${name}`;
      const createdBy = theLead.createdBy;

      await sendCollabNotification({
        assignedTo,
        title,
        text,
        createdBy,
        type,
        id,
      });
      console.log('Get the lead');
      // dispatch(getLead(leadId));
      await fetchClientLead(leadId);
    } else if (type === 'lead_pitch') {
      //pitch
      const newFields = { pitch: url };
      await updateDoc(leadRef, newFields);
      const assignedTo = theLead.collab;

      const title = 'Lead pitch has been uploaded';
      const text = `Lead Name: ${name}`;
      const createdBy = theLead.createdBy;

      await sendCollabNotification({
        assignedTo,
        title,
        text,
        createdBy,
        type,
        id,
      });
      console.log('Get the lead');
      //   dispatch(getLead(leadId));
      await fetchClientLead(leadId);
    } else if (type === 'lead_invoice') {
      //invoice
      const newFields = { invoice: url };
      await updateDoc(leadRef, newFields);
      const assignedTo = theLead.collab;

      const title = 'Lead invoice has been uploaded';
      const text = `Lead Name: ${name}`;
      const createdBy = theLead.createdBy;

      await sendCollabNotification({
        assignedTo,
        title,
        text,
        createdBy,
        type,
        id,
      });
      console.log('Get the lead');
      await fetchClientLead(leadId);
      //   dispatch(getLead(leadId));
    }
    //   dispatch({ type: LEAD_FILE_URL, payload: null });
    store.dispatch(setLeadFileUrl(null));
  } catch (error) {
    console.error('Error updating lead doc: ', error);
  }
};

//Change Leac Stage//
export const toggleLeadStage = async ({ newStage, leadId }) => {
  const leadRef = doc(firestore, 'client_leads', leadId);
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

    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });

    console.log('Get the lead');
    //   dispatch(getLead(leadId));
    await fetchClientLead(leadId);
  } catch (error) {
    console.error(error.message);
  }
};

//Convert a lead to client//
export const convertLeadToClient = async ({
  leadId,
  name,
  email,
  number,
  address,
  createdAt,
}) => {
  const leadRef = doc(firestore, 'client_leads', leadId);
  const clientRef = collection(firestore, 'user_clients');
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

    await sendCollabNotification({
      assignedTo,
      title,
      text,
      createdBy,
      type,
      id,
    });
    console.log('Get the lead');
    //   dispatch(getLead(leadId));
    await fetchClientLead(leadId);
  } catch (error) {
    console.error(error.message);
  }
};
