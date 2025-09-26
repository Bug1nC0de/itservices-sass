import { collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebse-config';
import moment from 'moment';
import { createInvoice } from './main-notifications';
import {
  setServices,
  setClient,
  setDocServices,
  setQuotes,
  setInvoices,
  setInfo,
} from '../../slices/accountingSlice';
import store from '../../store';

export const fetchServices = async () => {
  try {
    const servicesCollection = collection(firestore, 'service');
    const snapshot = await getDocs(servicesCollection);
    const services = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    store.dispatch(setServices(services));
  } catch (error) {
    console.error('Error fetching services:', error.message);
  }
};

export const setDocClient = (client) => {
  store.dispatch(setClient(client));
};

export const setDocuServices = (services) => {
  store.dispatch(setDocServices(services));
};

export const getQuotes = async () => {
  try {
    const quotesCollection = collection(firestore, 'quotes');
    const snapshot = await getDocs(quotesCollection);
    const quotes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    store.dispatch(setQuotes(quotes));
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
    const invoices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    store.dispatch(setInvoices(invoices));
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
  }
};

export const setDocumentInfo = ({ info }) => {
  try {
    console.log('Set Doc Info: ', info);
    //   dispatch({ type: SET_DOC_VAR, payload: info });
    store.dispatch(setInfo(info));
  } catch (error) {
    console.error('Error setting doc Var: ', error.message);
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
    return 'success';
    //   dispatch(setAlert('Invoice created successfully', 'success'));
  } catch (error) {
    console.error('Error saving quote:', error);
    return 'failed';
  }
};
