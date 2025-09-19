import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchClientSuppliers } from '../../api/users/supplierApi';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import { AddBoxOutlined } from '@mui/icons-material';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import SupplierGrid from './SupplierGrid';
import StatCard from '../common/StatCard';

const ClientSuppliers = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { client } = useSelector((state) => state.user);
  const { suppliers } = useSelector((state) => state.suppliers);

  const getSuppliers = async () => {
    await fetchClientSuppliers(client.id);
  };

  useEffect(() => {
    if (!suppliers && client) {
      getSuppliers();
    }
  }, [client, suppliers]);

  if (!suppliers) {
    return <CircularProgress />;
  }

  const navToSomewhere = () => {
    navigate('/');
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
            onClick={navToSomewhere}
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
        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard title="Current Suppliers" count={0} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <StatCard title="Supplier Aplpications" count={0} />
        </Grid>
      </Grid>
      {!suppliers ? (
        <CircularProgress />
      ) : suppliers.length > 0 ? (
        <SupplierGrid supplers={suppliers} />
      ) : (
        <Typography
          variant="h6"
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          No Suppliers
        </Typography>
      )}
    </Box>
  );
};

export default ClientSuppliers;
