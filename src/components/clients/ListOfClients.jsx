import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { tokens } from '../../theme';
import TheClient from './TheClient';
import { fetchAllClients } from '../../api/main/clientApi';
import { useSelector } from 'react-redux';

const ListOfClients = ({ addClient, clientId }) => {
  useEffect(() => {
    fetchAllClients();
  }, [fetchAllClients]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const { clients } = useSelector((state) => state.clients);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (clients === null) return <CircularProgress />;

  const clientSelected = (client) => {
    addClient(client);
    handleClose();
  };

  return (
    <Container>
      <Button
        onClick={handleOpen}
        fullWidth
        variant="outlined"
        sx={{
          color: colors.grey[500],
          borderColor: colors.grey[500],
          mb: '5px',
        }}
      >
        Exisiting client
      </Button>
      <Dialog open={open} onClose={handleClose} scroll="paper">
        <DialogTitle id="scroll-dialog-title">
          Who would you like to add to:
        </DialogTitle>
        <DialogContent>
          {clients.length === 0
            ? 'No Clients'
            : clients.map((client) => (
                <TheClient
                  key={client.id}
                  client={client}
                  clientSelected={clientSelected}
                  clientId={clientId}
                />
              ))}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ListOfClients;
