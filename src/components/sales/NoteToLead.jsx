import {
  Button,
  Modal,
  Box,
  Grid,
  TextField,
  useTheme,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useState } from 'react';
import moment from 'moment/moment';
import { tokens } from '../../theme';

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

const NoteToLead = ({ addToNoteArr, userInfo }) => {
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
      id: userInfo.id,
      name: userInfo.name,
    };
    addToNoteArr({ createdAt, createdBy, note });
    setAddingNote(false);
    setNote('');
    handleClose();
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleOpen}
        fullWidth
        sx={{
          color: colors.greenAccent[500],
          borderColor: colors.greenAccent[500],
        }}
      >
        Create a note
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Alert icon={false} severity="info">
            Add note
          </Alert>
          <form onSubmit={addNote}>
            <Grid>
              <TextField
                label="Note"
                variant="outlined"
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
              <LinearProgress color="success" />
            ) : (
              <Button
                variant="outlined"
                sx={{
                  color: colors.blueAccent[100],
                  borderColor: colors.blueAccent[100],
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
    </div>
  );
};

export default NoteToLead;
