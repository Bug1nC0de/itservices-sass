import { firestore } from '../../firebse-config';

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';

export const fetchNotifications = async (userId) => {
  try {
    const q = query(
      collection(firestore, 'notifications'),
      where('targetId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Notofications: ', notifications);
    // dispatch({
    //   type: FETCH_NOTIFICATIONS,
    //   payload: notifications,
    // });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
  }
};

export const deleteNotification = async ({ id, userId }) => {
  try {
    await deleteDoc(doc(firestore, 'notifications', id));
    await fetchNotifications(userId);
  } catch (error) {
    console.error('Error deleting notification:', error.message);
  }
};
