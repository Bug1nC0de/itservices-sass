import { useSelector } from 'react-redux';
import MainTodos from './MainTodos';
import UserTodos from './UserTodos';
import { CircularProgress } from '@mui/material';

const Todos = () => {
  const { userInfo } = useSelector((state) => state.auth);
  if (!userInfo) {
    return <CircularProgress />;
  }

  const type = userInfo.profileType;

  if (type === 'itservices') {
    return <MainTodos />;
  } else if (type === 'user') {
    return <UserTodos />;
  } else {
    return <CircularProgress />;
  }
};

export default Todos;
