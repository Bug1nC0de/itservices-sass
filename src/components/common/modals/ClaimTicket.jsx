import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { claimTicket } from '../../../api/main/helpdeskApi';
import { claimClientTicket } from '../../../api/users/helpdeskApi';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EngineeringIcon from '@mui/icons-material/Engineering';
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

const ClaimTicket = ({
  techId,
  techName,
  ticketId,
  assignedTo,
  email,
  createdBy,
  username,
  userId,
  userClientId,
}) => {
  const [open, setOpen] = useState(false);
  const [assignedId, setAssignedId] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (assignedTo) {
      setAssignedId(assignedTo.id);
    } else {
      setAssignedId(null);
    }
  }, [assignedTo]);

  const forMe = async () => {
    setClaiming(true);
    if (!userClientId) {
      const res = await claimTicket({
        ticketId,
        techId,
        techName,
        email,
        createdBy,
        username,
        userId,
      });
      if (res === 'success') {
        toast.success('Ticket successfully claimed');
      } else {
        toast.error('Something went wrong...');
      }
    } else {
      const res = await claimClientTicket({
        ticketId,
        techId,
        techName,
        email,
        createdBy,
        username,
        userId,
      });

      if (res === 'success') {
        toast.success('Ticket successfully claimed');
      } else {
        toast.error('Something went wrong...');
      }
    }

    setClaiming(false);
    handleClose();
  };

  return (
    <div>
      {assignedId ? (
        assignedId === techId ? (
          //Ticket belongs to currently signed in tech//
          <Button color="info">
            <EngineeringIcon />
          </Button>
        ) : (
          //ticket Belongs to another tech
          <Button color="success">
            <CheckCircleIcon />
          </Button>
        )
      ) : (
        <Button onClick={handleOpen} color="error">
          <CancelIcon />
        </Button>
      )}

      <Modal open={open} onClose={handleClose} id="modal-options">
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Are you sure you want to claim this ticket?
          </Typography>
          <Grid container sx={{ mt: 4 }}>
            <Grid size={{ xs: 6 }}>
              <Button variant="outlined" onClick={handleClose}>
                No
              </Button>
            </Grid>
            <Grid size={{ xs: 6 }}>
              {claiming ? (
                <CircularProgress />
              ) : (
                <Button variant="outlined" color="success" onClick={forMe}>
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

export default ClaimTicket;
