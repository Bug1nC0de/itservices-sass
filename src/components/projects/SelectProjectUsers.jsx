import {
  Grid,
  Alert,
  Modal,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { assignUser } from '../../api/main/projectApi';
import { useState } from 'react';

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

const SelectProjectUsers = ({ projectId, users }) => {
  const [open, setOpen] = useState(false);
  const [proUsr, setProUser] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const assign = (e) => {
    e.preventDefault();
    let proUser = { id: proUsr.id, name: proUsr.name };
    assignUser({
      proUser,
      projectId,
    });

    setOpen(false);
  };
  return (
    <>
      <Button color="warning" size="small" onClick={handleOpen}>
        Assign
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid item>
            <Alert icon={false} variant="filled" severity="success">
              Assign Project User
            </Alert>
            {users && users.length === 0
              ? 'No Users'
              : users.map((user) => (
                  <div key={user.id}>
                    <List>
                      <ListItemButton onClick={() => setProUser(user)}>
                        <ListItem>
                          <ListItemText primary={`${user.name}`} />
                        </ListItem>
                      </ListItemButton>
                    </List>
                    <Divider />
                  </div>
                ))}

            {!proUsr ? (
              <Button mt={2} disabled fullWidth>
                Select User
              </Button>
            ) : (
              <Button
                onClick={assign}
                variant="outlined"
                color="success"
                fullWidth
                mt={2}
              >
                Confirm {proUsr.name} <SkipNextIcon />
              </Button>
            )}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default SelectProjectUsers;
