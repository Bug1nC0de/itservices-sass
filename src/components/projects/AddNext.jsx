import { useState } from 'react';
import { Grid, Alert, TextField, Modal, Button, Box } from '@mui/material';
import { SkipNext, Add } from '@mui/icons-material';
import moment from 'moment';
import { addNext } from '../../api/main/projectApi';

const style = {
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

const AddNext = ({ projectId }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const create = (e) => {
    e.preventDefault();

    let createdAt = moment().format();

    addNext({
      text,
      projectId,
      createdAt,
    });

    setOpen(false);
  };
  return (
    <>
      <Button
        style={{ marginTop: '7px' }}
        color="warning"
        variant="outlined"
        size="small"
        onClick={handleOpen}
      >
        <Add color="warning" />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid item>
            <Alert icon={false} variant="filled" severity="warning">
              Add whats next
            </Alert>
            <Grid item style={{ marginBottom: '10px' }}>
              <TextField
                label="Whats next?"
                variant="outlined"
                type="text"
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Button
              onClick={create}
              variant="contained"
              color="warning"
              fullWidth
            >
              Add Whats Next <SkipNext />
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default AddNext;
