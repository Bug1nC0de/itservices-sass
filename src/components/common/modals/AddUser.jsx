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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
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

const AddUser = ({ client, clientId, createAnewUser }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    position: '',
    cellphone: '',
    password: '',
    password2: '',
  });
  const { name, surname, position, email, cellphone, password, password2 } =
    formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setFormError('Passwords do not match...');
      setTimeout(() => setFormError(null), 4000);
    } else {
      setCreating(true);
      let createdAt = moment().format();
      if (!clientId) {
        //New Tech//
        const res = await createAnewUser({
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
        const clientName = client.name;

        const res = await createAnewUser({
          name,
          surname,
          position,
          email,
          cellphone,
          password,
          clientId,
          createdAt,
          clientName,
        });

        if (res === true) {
          setCreating(false);
          setOpen(false);
        } else {
          setFormError('Something went wrong please try again later...');
          setTimeout(() => setFormError(null), 4000);
        }
      }
    }
  };
  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        sx={{
          color: colors.greenAccent[500],
          borderColor: colors.greenAccent[500],
        }}
        size="small"
      >
        <PersonAddAltIcon />
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
                  onChange={onChange}
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
                  onChange={onChange}
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
                  onChange={onChange}
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
                  onChange={onChange}
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
                  onChange={onChange}
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
                  onChange={onChange}
                  autoComplete="off"
                  fullWidth
                  required
                />
              </Grid>
              <Grid>
                <TextField
                  label="Please verify password"
                  variant="outlined"
                  type="password"
                  name="password2"
                  value={password2}
                  onChange={onChange}
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

export default AddUser;
