import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../firebse-config';
import { nanoid } from 'nanoid';
import store from '../store';
import { setProgress, setFileUrl } from '../slices/storageSlice';

//Upload file//
export const uploadFile = async ({ type, file }) => {
  try {
    const name = nanoid(8);
    const uploadRef = ref(storage, `/${type}/${name}`);
    const uploadTask = uploadBytesResumable(uploadRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        store.dispatch(setProgress(prog));
        if (prog === 100) {
          store.dispatch(setProgress(null));
        }
      },
      (error) => console.error(error.message),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const data = {
            url: downloadURL,
            type: type,
          };
          store.dispatch(setFileUrl(data));
        });
      }
    );
  } catch (error) {
    console.error(error);
  }
};

//Delete file//
export const deleteFile = async ({ url }) => {
  const deleteRef = ref(storage, url);
  try {
    await deleteObject(deleteRef);
    return 'success';
  } catch (error) {
    console.log('Error deleting file; ', error.message);
    return 'error';
  }
};

//Cear File Url//
export const clearFileUrl = () => {
  store.dispatch(setFileUrl(null));
};
