import { Box, CircularProgress, Grid } from '@mui/material';
import StatCard from '../common/StatCard';
import { fetchAllClients } from '../../api/main/clientApi';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ClientGrid from './ClientGrid';
import AddClient from '../common/modals/AddClient';
const MainClients = () => {
  const { clients } = useSelector((state) => state.clients);
  const getClients = async () => {
    await fetchAllClients();
  };

  useEffect(() => {
    getClients();
  }, []);

  if (!clients) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Your Clients" count={clients.length} />
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

export default MainClients;
