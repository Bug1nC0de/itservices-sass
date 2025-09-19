import { useSelector } from 'react-redux';
import MainManagement from './MainManagement';
import UserManagement from './UserManagement';
import { CircularProgress } from '@mui/material';

const Management = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <CircularProgress />;
  }

  const type = userInfo.profileType;

  if (type === 'itservices') {
    return <MainManagement />;
  } else if (type === 'user') {
    return <UserManagement />;
  } else {
    return <CircularProgress />;
  }
};

export default Management;
