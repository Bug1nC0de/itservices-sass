import { useState } from 'react';
import { Button, Modal, Box, Grid, Alert, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createDepartment } from '../../api/users/userApi';
import { createITDepartment } from '../../api/main/techApi';

const CreateDepartment = ({ clientId, user }) => {
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
    if (name.length < 3) {
      setFormError('Please give the department a name');
      setTimeout(() => setFormError(null), 4000);
    } else {
      if (!clientId) {
        let createdBy = {
          org: 'Call IT Services',
          name: user.name,
        };
        createITDepartment({ name, createdBy });
        setCreating(true);
      } else {
        let createdBy = {
          org: user.clientName,
          name: user.name,
        };
        createDepartment({ name, clientId, createdBy });
        setCreating(true);
      }
    }
  };
  return (
    <div>
      <Button sx={{ marginTop: '10px' }} size="small" onClick={handleOpen}>
        <AddIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid>
            <Alert icon={false} variant="filled" severity="info">
              Give the department a name
            </Alert>
            {formError && (
              <Button variant="contained" color="error" id="error-btn">
                {formError}
              </Button>
            )}
            <Grid style={{ marginBottom: '10px' }}>
              <TextField
                label="Department name?"
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
                color="info"
                onClick={create}
                fullWidth
              >
                Add department
              </Button>
            )}
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateDepartment;
