import axios from 'axios';
const backend = import.meta.env.VITE_BACKEND_URL;

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

//Send notifications//
export const sendCollabNotification = async ({
  assignedTo,
  title,
  text,
  createdBy,
  type,
  id,
}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    assignedTo,
    title,
    text,
    createdBy,
    type,
    id,
  });

  try {
    await axios.post(
      `${backend}/api/client-notifications/notify-client-collab`,
      body,
      config
    );

    return true;
  } catch (error) {
    console.error('Error sending collab notification: ', error);
    return false;
  }
};

/////////////////////////
//Backend helpdesk apis//
/////////////////////////
//Ticket Creation notification//
export const sendTicketCreationNotification = async ({
  email,
  username,
  header,
  userId,
}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const body = JSON.stringify({ email, username, header, userId });

    await axios.post(
      `${backend}/api/client-notifications/ticket-for-user`,
      body,
      config
    );
    return true;
  } catch (error) {
    console.error('Error sending ticket notification: ', error);
    return false;
  }
};

//Text notification//
export const sendTextNotification = async ({ ticketId, to, text }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ ticketId, to, text });
  try {
    await axios.post(
      `${backend}/api/client-notifications/text-notification`,
      body,
      config
    );

    return true;
  } catch (error) {
    console.error('Error Sending text notification: ', error);
    return false;
  }
};

//Ticket claimed notification//
export const ticketHasBeenClaimed = async ({
  email,
  username,
  clientUserId,
  ticketId,
}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email, username, clientUserId, ticketId });
  try {
    await axios.post(
      `${backend}/api/client-notifications/client-claimed-ticket`,
      body,
      config
    );

    return true;
  } catch (error) {
    console.error('Error sending claimed ticket notificatio: ', error);
    return false;
  }
};

//Ticket has been closed//
export const ticketHasBeenClosed = async ({
  email,
  username,
  ticketNum,
  userId,
  ticketId,
}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      email,
      username,
      ticketNum,
      userId,
      ticketId,
    });
    await axios.post(
      `${backend}/api/client-notifications/close-the-ticket`,
      body,
      config
    );
    return true;
  } catch (error) {
    console.error('Error Closing ticket', error);
    return false;
  }
};

///////////////////////////
//Backend ITServices apis//
///////////////////////////
//ticket creatiion notification//
export const ticketCreatedNotification = async ({ user, ticketId }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ user, ticketId });
    await axios.post(`${backend}/api/appemails/ticket-created`, body, config);
  } catch (error) {
    console.log('Error sending ticket creation notification: ', error);
  }
};

//text notification//
export const messageNotification = async ({ ticketId, to, text }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ ticketId, to, text });

  await axios.put(`/${backend}/api/appemails/text-notification`, body, config);
};

//Ticket Closed Notification//
export const ticketClosedNotification = async ({ email, user, ticketId }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, user, ticketId });
    await axios.post(`${backend}/api/appemails/ticket-closed`, body, config);
  } catch (error) {
    console.error(error.message);
  }
};

//Send email and notify user that ticket is created on their behalf//
export const notifyUser = async ({ email, username, header, userId }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email, username, header, userId });

  await axios.post(`${backend}/api/appemails/ticket-onbehalf`, body, config);
};

//text notification//
export const textNotification = async ({ ticketId, to, text }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ ticketId, to, text });

  await axios.put(`${backend}/api/appemails/text-notification`, body, config);
};

//send email and notification that the ticket has been claimed//
export const ticketClaimed = async ({ email, username, userId, ticketId }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, username, userId, ticketId });
    await axios.post(`${backend}/api/appemails/ticket-claimed`, body, config);
  } catch (error) {
    console.error('Email Js Error;', error.message);
  }
};

//Send email and notification to user that the ticket has been resolved//
export const closingTicketEmail = async ({
  email,
  username,
  ticketNum,
  userId,
  ticketId,
}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      email,
      username,
      ticketNum,
      userId,
      ticketId,
    });
    await axios.post(`${backend}/api/appemails/ticket-closed`, body, config);
  } catch (error) {
    console.error(error.message);
  }
};

//Send collab notification//
export const notifyCollab = async ({
  assignedTo,
  title,
  text,
  createdBy,
  type,
  id,
}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ assignedTo, title, text, createdBy, type, id });

  await axios
    .post(`${backend}/api/appemails/notify-collab`, body, config)
    .catch((error) => console.error('Notify Collab Error:', error.message));
};

//Create invoice//
export const createInvoice = async ({ data, type, leadId }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ data, type, leadId });

  await axios
    .post(`${backend}/api/accounting/create-invoice`, body, config)
    .catch((error) => console.error('Notify Project Error:', error.message));
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
