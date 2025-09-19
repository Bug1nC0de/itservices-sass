import { useSelector } from 'react-redux';
import MainSales from './MainSales';
import UserSales from './UserSales';
import { CircularProgress } from '@mui/material';
const Sales = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <CircularProgress />;
  }

  const type = userInfo.profileType;

  if (type === 'itservices') {
    return <MainSales />;
  } else if (type === 'user') {
    return <UserSales />;
  } else {
    return <CircularProgress />;
  }
};

export default Sales;
