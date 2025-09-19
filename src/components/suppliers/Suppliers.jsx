import { useSelector } from 'react-redux';
import ClientSuppliers from './ClientSuppliers';
import MainSuppliers from './MainSuppliers';
import { CircularProgress } from '@mui/material';

const Suppliers = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <CircularProgress />;
  }
  const type = userInfo.profileType;

  if (type === 'itservices') {
    return <MainSuppliers />;
  } else if (type === 'user') {
    return <ClientSuppliers />;
  } else {
    return <CircularProgress />;
  }
};

export default Suppliers;
