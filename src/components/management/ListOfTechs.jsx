import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { tokens } from '../../theme';
import TheTech from './TheTech';
import GroupIcon from '@mui/icons-material/Group';
import { getTechs } from '../../api/main/techApi';
import { useSelector } from 'react-redux';

const ListOfTechs = ({ addTech, removeTech, updateMyCollab, collab }) => {
  useEffect(() => {
    getTechs();
  }, [getTechs]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  if (users === null) return <CircularProgress />;

  const techChosen = (tech) => {
    addTech(tech);
  };

  const techRemove = (techId) => {
    removeTech(techId);
  };

  const updateCollab = () => {
    updateMyCollab();
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          color: colors.grey[500],
          borderColor: colors.grey[500],
        }}
      >
        <GroupIcon />
      </Button>
      <Dialog open={open} onClose={handleClose} scroll="paper">
        <DialogTitle id="scroll-dialog-title">
          Who would you like to add to:
        </DialogTitle>
        <DialogContent>
          {users.length === 0
            ? 'No Techs'
            : users.map((tech) => (
                <TheTech
                  key={tech.id}
                  tech={tech}
                  techChosen={techChosen}
                  techRemove={techRemove}
                  collab={collab}
                />
              ))}
        </DialogContent>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderColor: colors.redAccent[700],
            color: colors.redAccent[700],
            mb: '5px',
            ml: '28px',
            width: '80%',
          }}
          onClick={updateCollab}
        >
          Update collab
        </Button>
      </Dialog>
    </>
  );
};

export default ListOfTechs;
