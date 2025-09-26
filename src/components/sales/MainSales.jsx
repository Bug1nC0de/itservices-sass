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
  const navToLead = () => {
    navigate(`/add-lead`);
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
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 1,
          mt: -1,
        }}
      >
        <Typography variant="h6">Sales</Typography>
        <Button
          size="small"
          sx={{ color: colors.grey[200], mr: 15 }}
          onClick={navToLead}
        >
          <AddBoxOutlined />
        </Button>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box
          sx={{
            flex: '1 1 240px',
            minWidth: 240,
            maxWidth: 360,
          }}
        >
          <StatCard title="Pipeline worth" count={0} />
        </Box>

        <Box
          sx={{
            flex: '1 1 240px',
            minWidth: 240,
            maxWidth: 360,
          }}
        >
          <StatCard title="Active Sales" count={leads && leads.length} />
        </Box>

        <Box
          sx={{
            flex: '1 1 240px',
            minWidth: 240,
            maxWidth: 360,
          }}
        >
          <StatCard
            title="Collaborated Sales"
            count={collab_leads && collab_leads.length}
          />
        </Box>

        <Box
          sx={{
            flex: '1 1 240px',
            minWidth: 240,
            maxWidth: 360,
          }}
        >
          <StatCard
            title="Closed Sales"
            count={closed_leads && closed_leads.length}
          />
        </Box>

        <Box
          sx={{
            flex: '1 1 240px',
            minWidth: 240,
            maxWidth: 360,
          }}
        >
          <StatCard title="Average close rate" count={0} />
        </Box>
      </Box>
      {loading && <LinearProgress color="success" />}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {!kleads ? (
          <CircularProgress />
        ) : kleads.length > 0 ? (
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <SalesKanban
              sales={kleads}
              onMove={handleMove}
              stagesOrder={['Recon', 'Pitch', 'Quote', 'Follow up', 'Close']}
            />
          </Box>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
            No Leads Yet...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MainSales;
