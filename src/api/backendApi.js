import axios from 'axios';
const backend = import.meta.env.VITE_BACKEND_URL;

//Create
export const clientCreateUser = async ({
  name,
  surname,
  position,
  email,
  cellphone,
  password,
  clientId,
  createdAt,
  clientName,
}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      name,
      surname,
      position,
      email,
      cellphone,
      password,
      clientId,
      createdAt,
      clientName,
    });
    const res = await axios.post(
      `${backend}/api/firebase-admin/client-create-user`,
      body,
      config
    );

    console.log(res);
    return res.data;
  } catch (error) {
    console.error('Error Creating user', error);
  }
};

//Create a client user//
export const createClientUser = async ({
  name,
  surname,
  position,
  email,
  cellphone,
  password,
  user_clientId,
  createdAt,
  clientName,
}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    name,
    surname,
    position,
    email,
    cellphone,
    password,
    user_clientId,
    createdAt,
    clientName,
  });

  try {
    const res = await axios.post(
      `${backend}/api/firebase-admin/client-create-client-user`,
      body,
      config
    );

    console.log('Response from creating user: ', res);
    return res;
  } catch (error) {
    console.error('Error Creating User: ', error);
  }
};

//Create a user//
export const createUser = async ({ email, password }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post(
      `${backend}/api/firebase-admin/create-a-user`,
      body,
      config
    );
    console.log(res.data);
    const credentials = res.data.credentials;
    return credentials;
  } catch (error) {
    console.error('Error message: ', error);
  }
};
