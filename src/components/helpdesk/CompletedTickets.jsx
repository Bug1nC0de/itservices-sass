import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { tokens } from '../../theme';
import { fetchClosedTickets } from '../../api/main/helpdeskApi';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import TicketGrid from './TicketGrid';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftOutlined } from '@mui/icons-material';

const CompletedTickets = () => {
  const navigate = useNavigate();
  const { closed_tickets } = useSelector((state) => state.helpdesk);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getClosedTickets = async () => {
    await fetchClosedTickets();
  };

  useEffect(() => {
    getClosedTickets();
  }, []);

  if (!closed_tickets) return <CircularProgress />;
  return (
    <Box>
      <Grid container style={{ marginTop: -15, marginBottom: 10 }}>
        <Grid size={{ xs: 1 }}>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeftOutlined
              style={{ color: colors.grey[500], fontSize: 25, marginTop: -5 }}
            />
          </Button>
        </Grid>
        <Grid size={{ xs: 10 }}>
          <Typography variant="h6">Complete Tickets</Typography>
        </Grid>
      </Grid>
      {!closed_tickets ? (
        <CircularProgress />
      ) : closed_tickets.length > 0 ? (
        <TicketGrid helpdesk={closed_tickets} />
      ) : (
        <Typography
          variant="h6"
          style={{ marginTop: '20px', color: colors.redAccent[400] }}
        >
          No Tickets created
        </Typography>
      )}
    </Box>
  );
};

export default CompletedTickets;
