import { useEffect, useState } from 'react';
import {
  Card,
  Grid,
  CardContent,
  Modal,
  Box,
  Container,
  TextField,
  Button,
  CardActions,
  useTheme,
} from '@mui/material';
import { toast } from 'react-toastify';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';
import { signInUser, resetMyPassword } from '../../api/fireaseAuthApi';
import './Login.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo]);
  const [logginIn, setLoggingIn] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      await signInUser({ email, password });
    } catch (error) {
      toast.error(error.message);
      setLoggingIn(false);
    }
  };
  const passwordReset = async () => {
    setResetting(true);
    const res = await resetMyPassword(resetEmail);
    if (res === 'success') {
      toast.success('Password rest email sent, please check your spam.');
      setResetting(false);
    } else {
      toast.error('Error sending passsword reset email');
      setResetting(false);
    }
  };
  return (
    <Container>
      <Grid
        container
        spacing={2}
        id="sign-in-container"
        style={{ color: colors.primary['100'] }}
      >
        <Grid size={{ xs: 12, md: 6 }} id="sign-in">
          <h2>Sign in to your account</h2>
          <Card>
            <form onSubmit={onSubmit}>
              <CardContent>
                <Grid>
                  <TextField
                    label="Email"
                    type="email"
                    placeholder="Email"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid>
                  <TextField
                    label="Password"
                    placeholder="Enter Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Grid>
              </CardContent>
              <CardActions>
                {logginIn ? (
                  <Button
                    variant="outlined"
                    style={{
                      borderColor: colors.greenAccent['100'],
                      color: colors.greenAccent['100'],
                    }}
                    fullWidth
                  >
                    Login you in... <DoubleArrowIcon />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="outlined"
                    style={{
                      borderColor: colors.primary['100'],
                      color: colors.primary['100'],
                    }}
                    fullWidth
                  >
                    Login <DoubleArrowIcon />
                  </Button>
                )}
              </CardActions>
            </form>
          </Card>
          <Button
            style={{ color: colors.primary['100'] }}
            fullWidth
            onClick={() => navigate('/sign-up')}
          >
            Create Account
          </Button>
          <Button
            style={{ color: colors.primary['100'] }}
            fullWidth
            onClick={handleOpen}
          >
            Reset Password
          </Button>

          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
              <h4 style={{ color: colors.redAccent['500'] }}>
                Reset your password
              </h4>
              <TextField
                sx={{ marginBottom: '10px', marginTop: '10px' }}
                variant="outlined"
                label="Enter your email here..."
                placeholder="Enter your email here..."
                onChange={(e) => setResetEmail(e.target.value)}
                fullWidth
                required
              />
              {resetting ? (
                <Button
                  fullWidth
                  variant="outlined"
                  style={{
                    borderColor: colors.greenAccent['100'],
                    color: colors.greenAccent['100'],
                  }}
                >
                  Sending password reset link
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={passwordReset}
                  style={{
                    borderColor: colors.primary['100'],
                    color: colors.primary['100'],
                  }}
                >
                  Send password reset link
                </Button>
              )}
            </Box>
          </Modal>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
