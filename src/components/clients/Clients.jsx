import { useSelector } from 'react-redux';
import MainClients from './MainClients';
import UserClients from './UserClients';
import { CircularProgress } from '@mui/material';

const Clients = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <CircularProgress />;
  }

  const type = userInfo.profileType;

  if (type === 'itservices') {
    return <MainClients />;
  } else if (type === 'user') {
    return <UserClients />;
  } else {
    return <CircularProgress />;
  }
};

export default Clients;
