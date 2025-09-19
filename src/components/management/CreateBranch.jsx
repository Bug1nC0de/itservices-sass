import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button, Modal, Box, Grid, Alert, TextField } from '@mui/material';
import { createBranch } from '../../api/users/userApi';
import { createITBranch } from '../../api/main/techApi';

const CreateBranch = ({ clientId, user }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);

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
    pt: 2,
    px: 4,
    pb: 3,
  };

  const create = () => {
    if (name.length < 4) {
      setFormError('Please give the branch a name');
      setTimeout(() => setFormError(null), 4000);
    } else {
      if (!clientId) {
        let createdBy = {
          org: 'Call IT Services',
          name: user.name,
        };
        createITBranch({ name, createdBy });
        setCreating(true);
      } else {
        let createdBy = {
          org: user.clientName,
          name: user.name,
        };
        createBranch({ name, clientId, createdBy });
        setCreating(true);
      }
    }
  };
  return (
    <>
      <Button
        size="small"
        sx={{ marginTop: '10px' }}
        onClick={handleOpen}
        color="secondary"
      >
        <AddIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid>
            <Alert icon={false} variant="filled" severity="warning">
              Give the branch a name
            </Alert>
            {formError && (
              <Button variant="contained" color="error" id="error-btn">
                {formError}
              </Button>
            )}
            <Grid style={{ marginBottom: '10px' }}>
              <TextField
                label="Branch name?"
                variant="outlined"
                type="text"
                name="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            {creating ? (
              <Button variant="contained" disabled>
                Creating...
              </Button>
            ) : (
              <Button
                variant="contained"
                color="warning"
                onClick={create}
                fullWidth
              >
                Add branch
              </Button>
            )}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default CreateBranch;
