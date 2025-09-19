import { useContext, useState } from 'react';
import {
  Grid,
  AppBar,
  Box,
  Toolbar,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Fingerprint,
  LightModeOutlined,
  DarkModeOutlined,
  SettingsOutlined,
  Notifications,
  LogoutOutlined,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { ColorModeContext } from '../../theme';
import { useNavigate } from 'react-router-dom';
import logobp from '../../assets/logobp.png';
import { signOutUser } from '../../api/fireaseAuthApi';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goodbye = async () => {
    const res = await signOutUser();
    if (res === 'success') {
      navigate('/');
    } else {
      console.log('Failed to log you out');
      navigate('/');
    }
  };

  return (
    <Box>
      <AppBar
        position="static"
        style={{ background: 'transparent', boxShadow: 'none' }}
      />
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left section */}
        <Box
          display="flex"
          mt="25px"
          ml="5px"
          justifyContent="center"
          alignItems="center"
        >
          {!userInfo ? (
            <>
              {window.location.pathname !== '/' && (
                <img
                  alt="callitservices"
                  width="220px"
                  src={logobp}
                  onClick={() => navigate('/')}
                />
              )}
            </>
          ) : (
            <>
              {window.location.pathname !== '/' && (
                <img
                  alt="callitservices"
                  width="220px"
                  src={logobp}
                  onClick={() => navigate('/')}
                />
              )}
            </>
          )}
        </Box>

        {/* Right section (desktop + mobile menu) */}
        <Box display="flex" alignItems="center">
          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate('/sign-in')}>
                <Fingerprint />
              </MenuItem>
            </Menu>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === 'dark' ? (
                <LightModeOutlined />
              ) : (
                <DarkModeOutlined />
              )}
            </IconButton>
            {userInfo && (
              <IconButton onClick={goodbye}>
                <LogoutOutlined />
              </IconButton>
            )}
          </Box>
        </Box>
      </Toolbar>
    </Box>
  );
};

export default Navbar;
