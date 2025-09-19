import {
  Grid,
  Alert,
  AlertTitle,
  TextField,
  Modal,
  Button,
  Box,
} from '@mui/material';
import moment from 'moment';
import { createProject } from '../../api/main/projectApi';
import { useState } from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import WorkspacesIcon from '@mui/icons-material/Workspaces';

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

const AddProject = ({ client, clientId, userInfo }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [value, setValue] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const clientName = client.name;

  const onSubmit = (e) => {
    e.preventDefault();

    const createdBy = {
      name: userInfo.name,
      id: userInfo.id,
      webtoken: userInfo.webtoken ?? '',
      phonetoken: userInfo.phonetoken ?? '',
    };

    let createdAt = moment().format();
    let complete = false;
    let proUser = [];

    createProject({
      name,
      desc,
      value,
      clientId,
      createdAt,
      clientName,
      complete,
      proUser,
      createdBy,
    });

    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="success"
        onClick={handleOpen}
        size="small"
      >
        <WorkspacesIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid item>
            <Alert icon={false} variant="filled" severity="success">
              <AlertTitle>Add A Project:</AlertTitle>
            </Alert>
            <form onSubmit={onSubmit}>
              <Grid item>
                <TextField
                  label="Project Name"
                  variant="outlined"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Project Description"
                  variant="outlined"
                  type="text"
                  name="desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Project Value"
                  variant="outlined"
                  type="text"
                  name="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
              >
                Add Project <SkipNextIcon />
              </Button>
            </form>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default AddProject;
