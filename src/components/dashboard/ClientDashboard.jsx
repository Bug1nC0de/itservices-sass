import { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import StatCard from '../common/StatCard';
import { useSelector } from 'react-redux';
import { getClient } from '../../api/users/userApi';
import { fetchClientHelpdesk } from '../../api/users/helpdeskApi';
import {
  fetchClientLeads,
  fetchClientCollabLeads,
} from '../../api/users/salesApi';
import {
  fetchMyTodos,
  getAssignedTodos,
  getCompleteAssignedTodos,
  getCompletedTodos,
} from '../../api/users/todoApi';
import { fetchClientSuppliers } from '../../api/users/supplierApi';

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);
  const { client } = useSelector((state) => state.user);
  const { pending_tickets, closed_tickets, unassigned_tickets } = useSelector(
    (state) => state.helpdesk
  );
  const { leads, closed_leads, collab_leads } = useSelector(
    (state) => state.sales
  );
  const { myTodos, assigned, doneTodos } = useSelector((state) => state.todos);
  const { vetted_suppliers, supplier_apps } = useSelector(
    (state) => state.suppliers
  );
  const getTheClient = async () => {
    const clientId = userInfo.clientId;
    await getClient(clientId);
  };

  const getClientDashboard = async () => {
    const clientId = userInfo.clientId;
    const userId = userInfo.credentials;
    await fetchClientHelpdesk(clientId);
    await fetchClientLeads(userId);
    await fetchClientCollabLeads(userId);
    await fetchMyTodos(userId);
    await getAssignedTodos(userId);
    await getCompleteAssignedTodos(userId);
    await getCompletedTodos(userId);
    await fetchClientSuppliers(clientId);
    setLoading(false);
  };
  useEffect(() => {
    if (loading) {
      getClientDashboard();
    }
    if (!client) {
      getTheClient();
    }
  }, [client, loading]);

  if (!client || loading) {
    return <CircularProgress />;
  }
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

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Completed Tickets"
            count={closed_tickets && closed_tickets.length}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Sales Pipeline" count={leads && leads.length} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Collaborated Sales"
            count={collab_leads && collab_leads.length}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Closed Sales"
            count={closed_leads && closed_leads.length}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Your Todo's" count={myTodos && myTodos.length} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Assigned Todo's"
            count={assigned && assigned.length}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Completed Todo's"
            count={doneTodos && doneTodos.length}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard
            title="Vetted Suppliers"
            count={vetted_suppliers && vetted_suppliers.length}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard
            title="Supplier Applications"
            count={supplier_apps && supplier_apps.length}
          />
        </Grid>

        {/* Notifications */}
        {/* {!loading && <NotificationCard notifications={notifications} />} */}
      </Grid>
    </Box>
  );
};

export default ClientDashboard;
