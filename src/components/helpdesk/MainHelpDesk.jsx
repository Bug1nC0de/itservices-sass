import { useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  useTheme,
  CircularProgress,
  Divider,
  Button,
} from '@mui/material';
import StatCard from '../common/StatCard';
import { tokens } from '../../theme';
import {
  fetchTickets,
  mostActiveClients,
  fetchClosedTickets,
  fetchUnAssigned,
} from '../../api/main/helpdeskApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TicketGrid from './TicketGrid';
const MainHelpDesk = () => {
  const navigate = useNavigate();
  const { pending_tickets, most_active, closed_tickets, unassigned_tickets } =
    useSelector((state) => state.helpdesk);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fetchActiveTickets = async () => {
    await fetchTickets();
    await mostActiveClients();
    await fetchClosedTickets();
    await fetchUnAssigned();
  };

  useEffect(() => {
    fetchActiveTickets();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Open Tickets"
            count={pending_tickets && pending_tickets.length}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Unassigned Tickets"
            count={unassigned_tickets && unassigned_tickets.length}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          onClick={() => navigate('/closed-tickets')}
        >
          <StatCard
            title="Completed Tickets"
            count={closed_tickets && closed_tickets.length}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography
            variant="h5"
            style={{
              marginTop: 20,
              marginBottom: 10,
              color: colors.redAccent[500],
            }}
          >
            Active Tickets
          </Typography>
          {!pending_tickets ? (
            <CircularProgress />
          ) : pending_tickets.length > 0 ? (
            <TicketGrid helpdesk={pending_tickets} />
          ) : (
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              No Tickets created
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h6"
            style={{
              textAlign: 'center',
              marginTop: 10,
              color: colors.blueAccent[500],
            }}
          >
            Most Active Clients
          </Typography>

          {most_active && most_active.length > 0 ? (
            most_active.map((client) => (
              <Box key={client.clientId}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ p: 1 }}
                >
                  <Typography style={{ fontSize: 15 }}>
                    {client.clientName}
                  </Typography>
                  <Button
                    variant="outlined"
                    style={{
                      borderRadius: 8,
                      borderColor: colors.blueAccent[500],
                    }}
                  >
                    <Typography style={{ color: colors.blueAccent[500] }}>
                      {client.count} ticket/s
                    </Typography>
                  </Button>
                </Box>
                <Divider
                  style={{
                    color: colors.grey[500],
                  }}
                />
              </Box>
            ))
          ) : (
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              No active clients
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainHelpDesk;
