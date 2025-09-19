import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import UserProjects from './UserProjects';
import MainProjects from './MainProjects';

const Projects = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <CircularProgress />;
  }

  const type = userInfo.profileType;

  if (type === 'itservices') {
    return <MainProjects />;
  } else if (type === 'user') {
    return <UserProjects />;
  } else {
    return <CircularProgress />;
  }
};

export default Projects;
