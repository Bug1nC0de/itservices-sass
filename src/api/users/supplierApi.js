import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { firestore } from '../../firebse-config';
import store from '../../store';
import moment from 'moment';
import {
  setSuppliers,
  setSupplier,
  setVettedSuppliers,
  setSupplierApps,
} from '../../slices/supplierSlice';

//Create a supplier//
export const createSupplier = async ({ name, email, contact, clientId }) => {
  const supplierRef = collection(firestore, 'client_suppliers');
  try {
    const vetted = false;
    const createdAt = moment.format();
    await addDoc(supplierRef, {
      name,
      email,
      contact,
      vetted,
      clientId,
      createdAt,
    });
    await fetchClientSuppliers(clientId);
    return true;
  } catch (error) {
    console.error('Error creating supplier: ', error);
    return false;
  }
};

//Fetch supplier//
export const fetchClientSuppliers = async (id) => {
  const supplierRef = collection(firestore, 'client_suppliers');
  try {
    const q = query(
      supplierRef,
      where('clientId', '==', id),
      orderBy('createdAt')
    );
    onSnapshot(q, (snapshot) => {
      let suppliers = [];
      let vetted = [];
      let apps = [];
      snapshot.docs.forEach((doc) => {
        suppliers.push({ ...doc.data(), id: doc.id });
      });

      suppliers.map((supplier) => {
        if (supplier.vetted) {
          vetted.push(supplier);
        } else {
          apps.push(supplier);
        }
      });

      store.dispatch(setVettedSuppliers(vetted));
      store.dispatch(setSupplierApps(apps));
      store.dispatch(setSuppliers(suppliers));
    });
  } catch (error) {
    console.error('Error Fetching suppliers: ', error);
  }
};

//Fetch supplier//
export const fetchSupplier = async (id) => {
  const supplierRef = doc(firestore, 'client_suppliers', id);
  try {
    const supplierDoc = await getDoc(supplierRef);
    const supplier = supplierDoc.data();
    store.dispatch(setSupplier(supplier));
  } catch (error) {
    console.error('Error Fetching Supplier: ', error);
  }
};
