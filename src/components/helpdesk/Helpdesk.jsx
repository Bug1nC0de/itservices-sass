import ClientHelpdesk from './ClientHelpdesk';
import MainHelpDesk from './MainHelpDesk';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

const Helpdesk = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <CircularProgress />;
  }

  const type = userInfo.profileType;
  if (type === 'user') {
    return <ClientHelpdesk />;
  } else if (type === 'itservices') {
    return <MainHelpDesk />;
  } else {
    return <CircularProgress />;
  }
};

export default Helpdesk;
