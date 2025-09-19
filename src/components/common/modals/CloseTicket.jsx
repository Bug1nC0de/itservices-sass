import { useState } from 'react';
import {
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  Divider,
  CircularProgress,
} from '@mui/material';
import AlbumIcon from '@mui/icons-material/Album';
import { closeTicket } from '../../../api/main/helpdeskApi';
import { closeTheTicket } from '../../../api/users/helpdeskApi';
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

const CloseTicket = ({
  ticketId,
  closeBtn,
  email,
  ticketNum,
  username,
  userId,
  profileType,
}) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const done = async () => {
    setClosing(true);

    if (profileType === 'itservices') {
      const res = await closeTicket({
        ticketId,
        email,
        ticketNum,
        username,
        userId,
      });
      if (res === 'success') {
        toast.success('Ticket has been closed');
      } else {
        toast.error('Something went wrong');
      }
    } else {
      const res = await closeTheTicket({
        ticketId,
        email,
        ticketNum,
        username,
        userId,
      });
      if (res === 'success') {
        toast.success('Ticket has been closed');
      } else {
        toast.error('Something went wrong');
      }
    }

    setClosing(false);
  };

  return (
    <div>
      <Button color="warning" onClick={handleOpen}>
        <AlbumIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Are you sure you would like to close the ticket?
          </Typography>
          <Divider />
          <Grid container>
            <Grid size={{ xs: 6 }}>
              <Button variant="outlined" onClick={handleClose}>
                No
              </Button>
            </Grid>
            <Grid size={{ xs: 6 }}>
              {closing ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="outlined"
                  color="success"
                  ref={closeBtn}
                  onClick={done}
                >
                  Yes
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default CloseTicket;
