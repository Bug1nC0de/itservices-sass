import Navbar from './components/common/Navbar';
import AuthSideBar from './components/common/AuthSideBar';
import { Outlet, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebse-config';
import { persistLogin, signOutUser } from './api/fireaseAuthApi';

const App = () => {
  // const navigate = useNavigate();
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      persistLogin();
    } else {
      signOutUser();
    }
  });
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const noSidebarRoutes = ['/', '/sign-in', '/sign-up'];

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <ToastContainer />
        <div>
          {noSidebarRoutes.includes(location.pathname) ? (
            <div style={{ flexGrow: 1 }}>
              <Outlet />
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <div style={{ width: '250px', flexShrink: 0 }}>
                <AuthSideBar />
              </div>
              <div style={{ flexGrow: 1, padding: '1rem' }}>
                <Outlet />
              </div>
            </div>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
