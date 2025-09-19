import { useState } from 'react';
import { deleteTicket } from '../../api/main/helpdeskApi';
import {
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const TrashTicket = ({ clientId, ticketId }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const trash = () => {
    deleteTicket({ ticketId, clientId });
    handleClose();
  };

  return (
    <div>
      <IconButton color="error" onClick={handleOpen} edge="end">
        <DeleteForeverIcon />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Are you sure you would like to delete the ticket?
          </Typography>
          <Divider />
          <Typography gutterBottom>You cannot undo this action</Typography>

          <Grid container>
            <Grid item xs={6}>
              <Button variant="outlined" onClick={handleClose}>
                No
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" color="warning" onClick={trash}>
                Yes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default TrashTicket;
