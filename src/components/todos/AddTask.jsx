import { Alert, Box, Button, Grid, Modal, TextField } from '@mui/material';
import { useState } from 'react';
const AddTask = ({ addToTaskArr }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [formError, setFormError] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const create = () => {
    if (title.length < 3) {
      setFormError('Please give task a title');
      setTimeout(() => setFormError(null), 4000);
    } else {
      setTitle('');
      handleClose();

      addToTaskArr(title);
    }
  };

  return (
    <>
      <Button
        sx={{ marginTop: '10px' }}
        onClick={handleOpen}
        color="warning"
        variant="outlined"
        fullWidth
      >
        Add Task
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid item>
            <Alert icon={false} variant="outlined" severity="warning">
              Task title
            </Alert>
            {formError && (
              <Button variant="contained" color="error" id="error-btn">
                {formError}
              </Button>
            )}
            <Grid item style={{ marginBottom: '10px' }}>
              <TextField
                label="Task title?"
                variant="outlined"
                type="text"
                name="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Button
              variant="contained"
              color="warning"
              onClick={create}
              fullWidth
            >
              Add task
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default AddTask;
