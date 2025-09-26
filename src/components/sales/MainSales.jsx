import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Button,
  useTheme,
  LinearProgress,
} from '@mui/material';
import { AddBoxOutlined } from '@mui/icons-material';
import StatCard from '../common/StatCard';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SalesKanban from './SalesKanban';
import {
  fetchMyLeads,
  changeLeadStage,
  getCollabLeads,
} from '../../api/main/salesApi';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const MainSales = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [kleads, setKleads] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { leads, closed_leads, collab_leads } = useSelector(
    (state) => state.sales
  );
  const [loading, setLoading] = useState(false);

  const getLeads = async () => {
    await fetchMyLeads(userInfo.id);
    await getCollabLeads(userInfo.id);
  };

  useEffect(() => {
    if (!leads) {
      getLeads();
    }
  }, [leads]);
  useEffect(() => {
    if (leads && collab_leads) {
      const combined = [...leads, ...collab_leads];
      setKleads(combined);
    }
  }, [leads, collab_leads]);
  const navToLead = (id) => {
    navigate(`/lead-info/${id}`);
  };

  const handleMove = async (leadId, newStage) => {
    setLoading(true);
    const res = await changeLeadStage({ newStage, leadId });
    if (res === 'success') {
      toast.success('Update successfull');
    } else {
      toast.error('Update unsuccessfull');
    }
    setLoading(false);
  };
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container style={{ marginTop: -15 }}>
        <Grid size={{ xs: 11 }}>
          <Typography variant="h6">Sales</Typography>
        </Grid>
        <Grid size={{ xs: 1 }}>
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
      {loading && <LinearProgress color="success" />}
      <Grid>
        {!kleads ? (
          <CircularProgress />
        ) : kleads.length > 0 ? (
          <Grid container>
            <Grid size={{ xs: 12 }} sx={{ minWidth: 0, overflowX: 'hidden' }}>
              {!kleads ? (
                <CircularProgress />
              ) : kleads.length > 0 ? (
                <SalesKanban
                  sales={kleads}
                  onMove={handleMove}
                  stagesOrder={[
                    'Recon',
                    'Pitch',
                    'Quote',
                    'Follow up',
                    'Close',
                  ]}
                />
              ) : (
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
                  No Leads Yet...
                </Typography>
              )}
            </Grid>
          </Grid>
        ) : (
          <Typography
            variant="h6"
            style={{ textAlign: 'center', marginTop: '20px' }}
          >
            No Leads Yet...
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default MainSales;
