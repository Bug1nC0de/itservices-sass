import axios from 'axios';
const backend = import.meta.env.VITE_BACKEND_URL;

export const ticketCreatedNotification = async ({ user, ticketId }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ user, ticketId });
    await axios.post(
      `${backend}/api/main-notifications/ticket-created`,
      body,
      config
    );
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

  await axios.put(
    `/${backend}/api/main-notifications/text-notification`,
    body,
    config
  );
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
    await axios.post(
      `${backend}/api/main-notifications/ticket-closed`,
      body,
      config
    );
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

  await axios.post(
    `${backend}/api/main-notifications/ticket-onbehalf`,
    body,
    config
  );
};

//text notification//
export const textNotification = async ({ ticketId, to, text }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ ticketId, to, text });

  await axios.put(
    `${backend}/api/main-notifications/text-notification`,
    body,
    config
  );
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
    await axios.post(
      `${backend}/api/main-notifications/ticket-claimed`,
      body,
      config
    );
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
    await axios.post(
      `${backend}/api/main-notifications/ticket-closed`,
      body,
      config
    );
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
    .post(`${backend}/api/main-notifications/notify-collab`, body, config)
    .catch((error) => console.error('Notify Collab Error:', error.message));
};

//Send Project Text Notofocation//
export const projectTextNotification = async ({ title, text, referenceId }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ title, text, referenceId });
  await axios.put(
    `${backend}/api/main-notifications/project-texts-notification`,
    body,
    config
  );
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
