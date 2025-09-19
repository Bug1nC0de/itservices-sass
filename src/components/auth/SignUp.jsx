import { useState } from 'react';
import {
  Card,
  Grid,
  CardContent,
  Container,
  TextField,
  Button,
  CardActions,
  Typography,
} from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import { signUpBusiness } from '../../api/fireaseAuthApi';
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [signinUp, setSigningUp] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    accountHolder: '',
    address: '',
    number: '',
    email: '',
    password: '',
  });

  // universal onChange
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // simple form validation
  const validateForm = () => {
    return Object.values(formData).every((value) => value.trim() !== '');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) {
      setError('Please fill in all fields.');
      return;
    }

    setSigningUp(true);
    try {
      const res = await signUpBusiness(formData);
      toast.success(res.message);
    } catch (err) {
      console.error('You messed up: ', err);
      setError('Sign up failed. Please try again.');
    } finally {
      setSigningUp(false);
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
          <h2>Sign up your business</h2>
          <Card>
            <form onSubmit={onSubmit}>
              <CardContent>
                {error && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                <Grid>
                  <TextField
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid>
                  <TextField
                    label="Business Number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid>
                  <TextField
                    label="Business Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid>
                  <TextField
                    label="Account Holder"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid>
                  <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid>
                  <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
              </CardContent>

              <CardActions>
                {signinUp ? (
                  <Text>Signing you up...</Text>
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
                    Sign Up <DoubleArrowIcon />
                  </Button>
                )}
              </CardActions>
            </form>
          </Card>
          <Button
            fullWidth
            onClick={() => navigate('/sign-in')}
            style={{
              color: colors.primary['100'],
            }}
          >
            Already have an account
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUp;
