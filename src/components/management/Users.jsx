import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditUser from '../common/modals/EditUser';

const Users = ({ user }) => {
  return (
    <>
      <ListItem key={user.id} disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <PersonOutlineIcon />
          </ListItemIcon>
          <ListItemText primary={`${user.name} ${user.surname}`} />
          <EditUser user={user} />
        </ListItemButton>
      </ListItem>
    </>
  );
};

export default Users;
