import { Box, CircularProgress, Grid } from '@mui/material';
import StatCard from '../common/StatCard';
import { fetchTickets } from '../../api/main/helpdeskApi';
import {
  fetchCompleteTodos,
  fetchTodos,
  fetchAssignedTodos,
} from '../../api/main/todoApi';
import {
  fetchMyLeads,
  getCollabLeads,
  getScheduledFollowUps,
} from '../../api/main/salesApi';
import { getProjects } from '../../api/main/projectApi';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { pending_tickets } = useSelector((state) => state.helpdesk);
  const { userInfo } = useSelector((state) => state.auth);
  const { myTodos, doneTodos } = useSelector((state) => state.todos);
  const { leads, closed_leads, collab_leads, scheduled } = useSelector(
    (state) => state.sales
  );
  const { projects } = useSelector((state) => state.projects);

  const fetchDashboard = async ({ credentials, id }) => {
    setLoading(true);
    await fetchTickets();
    getProjects();
    await fetchCompleteTodos(credentials);
    await fetchTodos(credentials);
    await fetchAssignedTodos(credentials);
    await fetchMyLeads(id);
    await getCollabLeads(id);
    await getScheduledFollowUps(id);

    setLoading(false);
  };

  useEffect(() => {
    if (userInfo) {
      const credentials = userInfo.credentials;
      const id = userInfo.id;
      fetchDashboard({ id, credentials });
    }
  }, [userInfo]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {/* Open Tickets */}
        <Grid size={{ xs: 12, md: 4 }} onClick={() => navigate('/helpdesk')}>
          <StatCard
            title="Open Tickets"
            count={pending_tickets && pending_tickets.length}
          />
        </Grid>

        {/* Completed Todos */}
        <Grid size={{ xs: 12, md: 4 }} onClick={() => navigate('/todos')}>
          <StatCard
            title="Completed Todos"
            count={doneTodos && doneTodos.length}
          />
        </Grid>

        {/* Upcoming Tasks */}
        <Grid size={{ xs: 12, md: 4 }} onClick={() => navigate('/todos')}>
          <StatCard title="Upcoming Tasks" count={myTodos && myTodos.length} />
        </Grid>

        {/* Sales Pipeline */}
        <Grid size={{ xs: 12, md: 4 }} onClick={() => navigate('/sales')}>
          <StatCard title="Sales Pipeline" count={leads && leads.length} />
        </Grid>

        {/* Deals Closed */}
        <Grid size={{ xs: 12, md: 4 }} onClick={() => navigate('/sales')}>
          <StatCard
            title="Deals Closed"
            count={closed_leads && collab_leads.length}
          />
        </Grid>

        {/* Scheduled Follow-ups */}
        <Grid size={{ xs: 12, md: 4 }} onClick={() => navigate('/sales')}>
          <StatCard
            title="Scheduled Follow-ups"
            count={scheduled && scheduled.length}
          />
        </Grid>

        {/* Active Projects */}
        <Grid size={{ xs: 12, md: 4 }} onClick={() => navigate('/projects')}>
          <StatCard
            title="Active Projects"
            count={projects && projects.length}
          />
        </Grid>

        {/* Completed Projects */}
        <Grid size={{ xs: 12, md: 4 }} onClick={() => navigate('/projects')}>
          <StatCard title="Completed Projects" count={0} />
        </Grid>

        {/* Feature Requests */}
        <Grid size={{ xs: 12, md: 4 }} onClick={() => navigate('/projects')}>
          <StatCard title="Feature Requests" count={0} />
        </Grid>

        {/* Notifications */}
        {/* {!loading && <NotificationCard notifications={notifications} />} */}
      </Grid>
    </Box>
  );
};

export default MainDashboard;
