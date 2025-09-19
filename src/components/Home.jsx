import { Card, Grid, Typography, Button, Box } from '@mui/material';
import { Android, Apple } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logobp from '../assets/logobp.png';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <Grid container spacing={2} alignItems="center" id="home">
        {/* Left side: Login cards */}
        <Grid size={{ xs: 12, md: 6 }} id="login-container">
          <Card variant="outlined" id="user-login-card">
            <Typography
              align="center"
              variant="h4"
              sx={{ color: 'white' }}
              gutterBottom
            >
              Sign in to get help from your company
            </Typography>
            <Typography
              align="center"
              variant="h4"
              sx={{ color: 'white' }}
              gutterBottom
            >
              support department
            </Typography>
            <Box
              m={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                sx={{
                  height: 40,
                  backgroundColor: 'white',
                  color: 'black',
                  width: '50%',
                }}
                onClick={() => navigate('sign-in')}
              >
                Sign In
              </Button>
            </Box>
          </Card>

          <Card variant="outlined" id="business-login-card">
            <Typography
              align="center"
              variant="h4"
              sx={{ color: 'white' }}
              gutterBottom
            >
              For an effective way to support
            </Typography>
            <Typography
              align="center"
              variant="h4"
              sx={{ color: 'white' }}
              gutterBottom
            >
              your remote staff
            </Typography>
            <Typography
              align="center"
              variant="h4"
              sx={{ color: 'white' }}
              gutterBottom
            >
              sign into your business account
            </Typography>
            <Box
              m={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                sx={{
                  height: 40,
                  backgroundColor: 'white',
                  color: 'black',
                  width: '50%',
                }}
                onClick={() => navigate('sign-up')}
              >
                Sign Up
              </Button>
            </Box>
          </Card>

          {/* Shooting stars */}
          <div className="shooting-star star1"></div>
          <div className="shooting-star star2"></div>
          <div className="shooting-star star3"></div>
          <div className="shooting-star star4"></div>
          <div className="shooting-star star5"></div>
          <div className="shooting-star star6"></div>
          <div className="shooting-star star7"></div>
          <div className="shooting-star star8"></div>
          <div className="shooting-star star9"></div>
        </Grid>

        {/* Right side: Logo */}
        <Grid size={{ xs: 12, md: 6 }} id="logo-container">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-end"
            height="100%"
          >
            <img alt="callitservices" id="home-logo-image" src={logobp} />
          </Box>
        </Grid>
      </Grid>

      {/* App Store Section */}
      <Grid container id="app-store-container" spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h4"
            sx={{ color: 'black', marginTop: '25px' }}
            align="center"
            gutterBottom
          >
            Download the app
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Button
            variant="contained"
            endIcon={<Apple />}
            id="app-store-button"
            href="https://apps.apple.com/us/app/call-it-services/id1635325800"
            target="_blank"
          >
            Available on the iStore
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Button
            variant="contained"
            endIcon={<Android />}
            id="app-store-button"
            href="https://play.google.com/store/apps/details?id=co.za.callitservices.itservices_app&pli=1"
            target="_blank"
          >
            Available on the Play Store
          </Button>
        </Grid>
      </Grid>

      {/* Footer */}
      <Grid container className="footer">
        <Grid size={{ xs: 12, md: 6 }}>
          <div id="copyright-5129-particle" className="g-content g-particle">
            &copy; 2025 Call IT Services
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <div className="g-branding">
            Developed by{' '}
            <a href="https://www.callitservices.co.za/">Call IT Services</a>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
