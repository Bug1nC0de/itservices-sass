import { collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebse-config';
import moment from 'moment';
import { createInvoice } from './main-notifications';

export const fetchServices = async () => {
  try {
    const servicesCollection = collection(firestore, 'service');
    const snapshot = await getDocs(servicesCollection);
    const services = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Services: ', services);
  } catch (error) {
    console.error('Error fetching services:', error.message);
  }
};

export const setDocClient = (client) => {
  console.log('Set Doc Client: ', client);
  //   dispatch({ type: SET_DOC_CLIENT, payload: client });
};

export const setDocServices = (services) => {
  console.log('Set Doc Services: ', services);
  //   dispatch({ type: SET_DOC_SERVICES, payload: services });
};

export const getQuotes = async () => {
  try {
    const servicesCollection = collection(firestore, 'quotes');
    const snapshot = await getDocs(servicesCollection);
    const services = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Quotes: ', services);
  } catch (error) {
    console.error('Error fetching quotes:', error.message);
  }
};

export const createNewQuote = async ({
  clientDetails,
  quoteServices,
  quoteNumber,
  quoteDate,
  validUntil,
  total,
  vat,
  grandTotal,
  leadId,
}) => {
  const quoteData = {
    clientDetails,
    quoteServices,
    quoteNumber,
    quoteDate,
    validUntil,
    total,
    vat,
    grandTotal,
    leadId,
    createdAt: moment().format(),
  };

  try {
    const docRef = await addDoc(collection(firestore, 'quotes'), quoteData);

    // Combine ID and data manually
    const savedQuote = {
      id: docRef.id,
      ...quoteData,
    };

    await createInvoice({ data: savedQuote, type: 'quote', leadId });
    //   dispatch(setAlert('Quoted created successfully', 'success'));
    console.log('Alert Success');
  } catch (error) {
    console.error('Error saving quote:', error);
  }
};

export const getInvoices = async () => {
  try {
    const invoiceCollection = collection(firestore, 'invoices');
    const snapshot = await getDocs(invoiceCollection);
    const services = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Invoices: ', services);
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
  }
};

export const setDocumentInfo = ({ info }) => {
  try {
    console.log('Set Doc Info: ', info);
    //   dispatch({ type: SET_DOC_VAR, payload: info });
    return true;
  } catch (error) {
    console.error('Error setting doc Var: ', error.message);
    return false;
  }
};

export const createNewInvoice = async ({
  clientDetails,
  invoiceServices,
  invoiceNumber,
  invoiceDate,
  validUntil,
  total,
  vat,
  grandTotal,
  leadId,
}) => {
  const invoiceData = {
    clientDetails,
    invoiceServices,
    invoiceNumber,
    invoiceDate,
    validUntil,
    total,
    vat,
    grandTotal,
    leadId,
    createdAt: moment().format(),
  };

  try {
    const docRef = await addDoc(collection(firestore, 'invoices'), invoiceData);

    const savedInvoice = {
      id: docRef.id,
      ...invoiceData,
    };

    await createInvoice({ data: savedInvoice, type: 'invoice', leadId });
    console.log('Invoice created');
    //   dispatch(setAlert('Invoice created successfully', 'success'));
  } catch (error) {
    console.error('Error saving quote:', error);
  }
};
