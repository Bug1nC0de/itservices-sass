import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import StatCard from '../common/StatCard';
import { useSelector } from 'react-redux';
import { fetchClientHelpdesk } from '../../api/users/helpdeskApi';
import { useEffect } from 'react';
import TicketGrid from './TicketGrid';

const ClientHelpdesk = () => {
  const { client } = useSelector((state) => state.user);
  const { tickets, pending_tickets, closed_tickets, unassigned_tickets } =
    useSelector((state) => state.helpdesk);

  const fetchHelpdesk = async () => {
    await fetchClientHelpdesk(client.id);
  };

  useEffect(() => {
    if (!tickets && client) {
      fetchHelpdesk();
    }
  }, [tickets, client]);

  if (!client || !tickets) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h6" style={{ marginTop: -15 }}>
        {client.name} Helpdesk
      </Typography>

      <Divider
        variant="middle"
        sx={{ marginBottom: '8px', marginTop: '12px' }}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Open Tickets" count={pending_tickets.length} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Unassigned Tickets"
            count={unassigned_tickets.length}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Completed Tickets" count={closed_tickets.length} />
        </Grid>
      </Grid>
      {!tickets ? (
        <CircularProgress />
      ) : tickets.length > 0 ? (
        <TicketGrid helpdesk={tickets} />
      ) : (
        <Typography
          variant="h6"
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          No Tickets created
        </Typography>
      )}
    </Box>
  );
};

export default ClientHelpdesk;
