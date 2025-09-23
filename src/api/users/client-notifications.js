import axios from 'axios';
const backend = import.meta.env.VITE_BACKEND_URL;

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
