import { useEffect } from 'react';
import StatCard from '../common/StatCard';
import { useSelector } from 'react-redux';
import { fetchTickets, fetchProjects } from '../../api/users/callitservicesApi';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import CreateTicket from '../common/modals/CreateTicket';
import TicketGrid from '../helpdesk/TicketGrid';

const CallITServices = () => {
  const { tickets, projects } = useSelector((state) => state.callitservices);
  const { userInfo } = useSelector((state) => state.auth);
  const { client } = useSelector((state) => state.user);
  const getUserDashboard = async () => {
    await fetchTickets(userInfo.credentials);
    await fetchProjects(userInfo.credentials);
  };

  useEffect(() => {
    if (!tickets || !projects) {
      if (userInfo) {
        getUserDashboard();
      }
    }
  }, [userInfo, tickets, projects]);

  if (!tickets || !client || !projects) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ flexGrow: 1, p: 2, mt: -4 }}>
      <Grid container style={{ justifyContent: 'space-between' }}>
        <Grid size={{ xs: 10 }}>
          <Typography variant="h6">
            {client.name} IT Services Helpdesk
          </Typography>
        </Grid>
        <Grid size={{ xs: 2 }} style={{ marginTop: -15 }}>
          <CreateTicket client={client} user={userInfo} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginBottom: 2, marginTop: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard title="Your Tickets" count={tickets.length} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard title="Your Projects" count={projects.length} />
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

export default CallITServices;
