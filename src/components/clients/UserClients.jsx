import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import StatCard from '../common/StatCard';
import { getUserClients } from '../../api/users/clientApi';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AddClient from '../common/modals/AddClient';
import ClientGrid from './ClientGrid';

const UserClients = () => {
  const { clients } = useSelector((state) => state.clients);
  const { userInfo } = useSelector((state) => state.auth);
  const { client } = useSelector((state) => state.user);

  const getClients = async () => {
    await getUserClients(userInfo.clientId);
  };
  useEffect(() => {
    if (!clients) {
      getClients();
    }
  }, [clients]);

  if (!client) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2, mt: -4 }}>
      <Grid container style={{ justifyContent: 'space-between' }}>
        <Grid size={{ xs: 7 }}>
          <Typography variant="h6">{client.name} Clients</Typography>
        </Grid>
        <Grid size={{ xs: 4 }} style={{ marginTop: -15 }}>
          <AddClient />
        </Grid>
      </Grid>

      <Divider
        variant="middle"
        sx={{ marginBottom: '8px', marginTop: '8px' }}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Your Clients" count={0} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Client Users" count={0} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Recent Activity" count={0} />
        </Grid>
      </Grid>

      {!clients ? (
        <CircularProgress />
      ) : clients.length > 0 ? (
        <ClientGrid clients={clients} />
      ) : (
        <Grid style={{ textAlign: 'center', marginTop: 10 }}>
          <Typography variant="h6">Create your first client</Typography>
          <AddClient />
        </Grid>
      )}
    </Box>
  );
};

export default UserClients;
