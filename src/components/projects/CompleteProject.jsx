import { useState } from 'react';
import { Grid, Alert, Modal, Button, Box, Typography } from '@mui/material';
import { DoneAll, Cancel } from '@mui/icons-material';
import { projectDone } from '../../api/main/projectApi';

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

const CompleteProject = ({ projectId, pending }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const finish = (e) => {
    e.preventDefault();

    projectDone(projectId);

    setOpen(false);
  };

  return (
    <>
      {pending === 'Start Up...' ? (
        <Button size="small" variant="outlined" disabled>
          Start Up...
        </Button>
      ) : pending ? (
        <Button size="small" variant="outlined" disabled>
          Pending
        </Button>
      ) : (
        <Button variant="outlined" size="small" onClick={handleOpen}>
          Done
        </Button>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid item>
            <Alert icon={false} variant="filled" severity="info">
              Project Name;
            </Alert>
            <Typography align="center" mt={1} mb={2}>
              Are you done with this projects?
            </Typography>

            <Grid sx={{ align: 'center' }} spacing={4} container>
              <Grid xs={6} item>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                  fullWidth
                >
                  No <Cancel />
                </Button>
              </Grid>
              <Grid xs={6} item>
                <Button
                  onClick={finish}
                  variant="outlined"
                  color="info"
                  fullWidth
                >
                  Yes <DoneAll />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default CompleteProject;
