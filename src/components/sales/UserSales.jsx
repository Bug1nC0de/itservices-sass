import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { AddBoxOutlined } from '@mui/icons-material';
import StatCard from '../common/StatCard';
import { useSelector } from 'react-redux';
import { fetchClientLeads } from '../../api/users/salesApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import SalesGrid from './SalesGrid';
const UserSales = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { client } = useSelector((state) => state.user);
  const { leads } = useSelector((state) => state.sales);

  const getLeads = async () => {
    await fetchClientLeads(client.id);
  };

  useEffect(() => {
    if (!leads && client) {
      getLeads();
    }
  }, [client, leads]);

  if (!client) {
    return <CircularProgress />;
  }

  const navToLead = (id) => {
    navigate(`/sales/${id}`);
  };
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container style={{ marginTop: -15 }}>
        <Grid size={{ xs: 10 }}>
          <Typography variant="h6">{client.name} Sales</Typography>
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Button
            size="small"
            sx={{ color: colors.grey[200] }}
            onClick={navToLead}
          >
            <AddBoxOutlined />
          </Button>
        </Grid>
      </Grid>

      <Divider
        variant="middle"
        sx={{ marginBottom: '8px', marginTop: '12px' }}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Pipeline worth" count={0} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Active Sales" count={0} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Closed Sales" count={0} />
        </Grid>
      </Grid>
      {!leads ? (
        <CircularProgress />
      ) : leads.length > 0 ? (
        <SalesGrid sales={leads} />
      ) : (
        <Typography
          variant="h6"
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          No Leads Yet...
        </Typography>
      )}
    </Box>
  );
};

export default UserSales;
