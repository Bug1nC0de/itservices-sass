import {
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import { addLeadNote } from '../../../api/main/salesApi';
import moment from 'moment/moment';
import { tokens } from '../../../theme';

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

const AddLeadNote = ({ leadId, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addNote = async (e) => {
    e.preventDefault();
    setAddingNote(true);
    let createdAt = moment().format();
    let createdBy = {
      id: user.id,
      name: user.name,
    };
    await addLeadNote({ leadId, note, createdAt, createdBy });
    setAddingNote(false);
    setNote('');
    handleClose();
  };

  return (
    <>
      <Button
        sx={{ color: colors.greenAccent[400] }}
        size="sm"
        onClick={handleOpen}
      >
        <AddIcon fontSize="small" />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ color: colors.blueAccent[400] }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Add note
          </Typography>
          <form onSubmit={addNote}>
            <Grid>
              <TextField
                label="Note"
                type="text"
                name="name"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                autoComplete="false"
                fullWidth
                required
              />
            </Grid>
            {addingNote ? (
              <LoadingButton
                loading
                fullWidth
                loadingPosition="center"
                variant="outlined"
              >
                loading...
              </LoadingButton>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  borderColor: colors.blueAccent[400],
                  color: colors.blueAccent[400],
                  mt: '10px',
                }}
                type="submit"
                fullWidth
              >
                Submit
              </Button>
            )}
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddLeadNote;
