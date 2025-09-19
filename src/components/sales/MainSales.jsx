import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { AddBoxOutlined } from '@mui/icons-material';
import StatCard from '../common/StatCard';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SalesGrid from './SalesGrid';
import { fetchMyLeads } from '../../api/main/salesApi';
import { useEffect } from 'react';

const MainSales = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userInfo } = useSelector((state) => state.auth);
  const { leads, closed_leads } = useSelector((state) => state.sales);

  const getLeads = async () => {
    await fetchMyLeads(userInfo.id);
  };

  useEffect(() => {
    if (!leads) {
      getLeads();
    }
  }, [leads]);
  const navToLead = (id) => {
    navigate(`/lead-info/${id}`);
  };
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container style={{ marginTop: -15 }}>
        <Grid size={{ xs: 10 }}>
          <Typography variant="h6">Sales</Typography>
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

      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Pipeline worth" count={0} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Active Sales" count={leads && leads.length} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Closed Sales"
            count={closed_leads && closed_leads.length}
          />
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

export default MainSales;
