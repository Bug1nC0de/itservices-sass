import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import ClientDashboard from './ClientDashboard';
import MainDashboard from './MainDashboard';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <CircularProgress />;
  }

  const type = userInfo.profileType;

  if (type === 'user') {
    return <ClientDashboard />;
  } else if (type === 'itservices') {
    return <MainDashboard />;
  } else {
    return <CircularProgress />;
  }
};

export default Dashboard;
