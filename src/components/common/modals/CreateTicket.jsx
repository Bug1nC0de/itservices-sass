import {
  Button,
  Modal,
  Box,
  Alert,
  AlertTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Input,
} from '@mui/material';
import moment from 'moment';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { createTicketForUser } from '../../../api/users/helpdeskApi';
import { createTicket } from '../../../api/users/callitservicesApi';
import { useState } from 'react';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CreateTicket = ({ client, clientUser, user }) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    header: '',
    desc: '',
  });
  const [howbad, setHowBad] = useState('');
  const [formError, setFormError] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { header, desc } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (howbad === '' || header === '') {
      setFormError('***Header & How bad is it are required**');
      setTimeout(() => setFormError(null), 4000);
    } else {
      const createdAt = moment().format();
      const clientId = client.id;
      const clientName = client.name;
      const createdBy = {
        userId: user.credentials,
        userName: user.name,
      };
      if (clientUser) {
        let userId = clientUser.credentials;
        let email = clientUser.email;
        let username = clientUser.name;

        createTicketForUser({
          username,
          header,
          desc,
          howbad,
          createdAt,
          userId,
          clientId,
          clientName,
          email,
          createdBy,
        });
        setSubmitting(true);
        setFormData({
          header: '',
          desc: '',
        });
        setHowBad('');
        toast.success('Ticket created for user successfully');
        handleClose();
      } else {
        let userId = user.credentials;
        let email = user.email;
        let username = user.name;
        createTicket({
          username,
          header,
          desc,
          howbad,
          createdAt,
          userId,
          clientId,
          clientName,
          email,
          createdBy,
        });
        toast.success('Ticket created successfully');
        handleClose();
      }
    }
  };

  return (
    <>
      <ConfirmationNumberIcon
        style={{ marginTop: '10px' }}
        color="error"
        onClick={handleOpen}
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Create a ticket on behalf of a client
          </Alert>
          {formError && (
            <Button variant="contained" color="error" id="error-btn">
              {formError}
            </Button>
          )}
          <form onSubmit={onSubmit}>
            <FormControl margin="normal" fullWidth>
              <InputLabel id="how-bad-is-it">How bad is it?</InputLabel>
              <Select labelId="how-bad-is-it" value={howbad}>
                <MenuItem
                  value="Not so bad"
                  onClick={() => setHowBad('Not so bad')}
                >
                  Not so bad
                </MenuItem>
                <MenuItem
                  value="Really bad"
                  onClick={() => setHowBad('Really bad')}
                >
                  Really bad
                </MenuItem>
                <MenuItem
                  value="Its a disaster"
                  onClick={() => setHowBad('Its a disaster')}
                >
                  Its a disaster
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl margin="normal" fullWidth>
              <InputLabel>Ticket Header</InputLabel>
              <Input value={header} onChange={onChange} name="header" />
            </FormControl>

            <FormControl margin="normal" fullWidth>
              <InputLabel id="desc">Description</InputLabel>
              <Input
                multiline={true}
                minRows={2}
                value={desc}
                onChange={onChange}
                name="desc"
              />
            </FormControl>
            {submitting === true ? (
              <Button variant="contained" disabled>
                Submiting...
              </Button>
            ) : (
              <Button variant="contained" type="submit">
                Submit
              </Button>
            )}
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CreateTicket;
