import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  TextField,
  useTheme,
} from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { tokens } from '../../../theme';
import moment from 'moment';
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
const EditUser = ({ editUser, user, clientId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [email, setEmail] = useState(user.email);
  const [cellphone, setCellPhone] = useState(user.cellphone ?? '');
  const [position, setPosition] = useState(user.position ?? '');
  const [password, setPassword] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    setCreating(true);
    let createdAt = moment().format();
    if (!clientId) {
      //New Tech//
      const res = await editUser({
        name,
        surname,
        position,
        email,
        cellphone,
        password,
        createdAt,
      });

      if (res === true) {
        setCreating(false);
        setOpen(false);
      } else {
        setFormError('Something went wrong please try again later...');
        setTimeout(() => setFormError(null), 4000);
      }
    } else {
      //New User//

      const res = await editUser({
        name,
        surname,
        position,
        email,
        cellphone,
        password,
        createdAt,
      });

      if (res === true) {
        setCreating(false);
        setOpen(false);
      } else {
        setFormError('Something went wrong please try again later...');
        setTimeout(() => setFormError(null), 4000);
      }
    }
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          color: colors.redAccent[500],
        }}
        size="small"
      >
        <EditIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid>
            <Alert icon={false} variant="filled" severity="info">
              <AlertTitle>Add A User:</AlertTitle>
            </Alert>
            {formError && (
              <Button variant="contained" color="error" id="error-btn">
                {formError}
              </Button>
            )}
            <form onSubmit={onSubmit}>
              <Grid mt={2}>
                <TextField
                  label="User Name"
                  variant="outlined"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="false"
                  fullWidth
                  required
                />
              </Grid>
              <Grid>
                <TextField
                  label="User Surname"
                  variant="outlined"
                  type="text"
                  name="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid>
                <TextField
                  label="User Position"
                  variant="outlined"
                  type="text"
                  name="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid>
                <TextField
                  label="User cellphone"
                  variant="outlined"
                  type="text"
                  name="cellphone"
                  value={cellphone}
                  onChange={(e) => setCellPhone(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid>
                <TextField
                  label="User Email"
                  variant="outlined"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  fullWidth
                  required
                />
              </Grid>

              {creating ? (
                <CircularProgress />
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="info"
                  fullWidth
                >
                  Add User <SkipNextIcon />
                </Button>
              )}
            </form>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default EditUser;
