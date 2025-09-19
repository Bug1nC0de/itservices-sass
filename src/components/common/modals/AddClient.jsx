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
import { useState } from 'react';
import { tokens } from '../../../theme';
import moment from 'moment';
import { createUserClient } from '../../../api/users/clientApi';

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

const AddClient = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    address: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { name, email, number, address } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    let createdAt = moment().format();

    const res = await createUserClient({
      name,
      email,
      address,
      number,
      createdAt,
    });
    if (res === true) {
      setCreating(false);
      setOpen(false);
    } else {
      setFormError('Something went wrong please try again later...');
      setTimeout(() => setFormError(null), 4000);
    }
    setFormData({
      name: '',
      email: '',
      number: '',
      address: '',
    });
    setCreating(true);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        sx={{
          color: colors.greenAccent[500],
          borderColor: colors.greenAccent[500],
          mt: '15px',
        }}
        size="small"
      >
        Add Client
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid>
            <Alert icon={false} variant="filled" severity="info">
              <AlertTitle>Add Client:</AlertTitle>
            </Alert>
            {formError && (
              <Button variant="contained" color="error" id="error-btn">
                {formError}
              </Button>
            )}
            <form onSubmit={onSubmit}>
              <Grid mt={2}>
                <TextField
                  label="Name"
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
                  label="Client Address"
                  variant="outlined"
                  type="text"
                  name="address"
                  value={address}
                  onChange={onChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid>
                <TextField
                  label="Client Number"
                  variant="outlined"
                  type="text"
                  name="number"
                  value={number}
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

              {creating ? (
                <CircularProgress />
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="info"
                  fullWidth
                >
                  Add Client <SkipNextIcon />
                </Button>
              )}
            </form>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default AddClient;
