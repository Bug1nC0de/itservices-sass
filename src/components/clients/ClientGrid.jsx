import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Typography, Button, Grid } from '@mui/material';
import { tokens } from '../../theme';
import { Business, ChevronRight } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

import moment from 'moment';
const ClientGrid = ({ clients }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: 'name',
      headerName: 'Client name',
      flex: 1,
      cellClassName: 'name-column--cell',
      renderCell: ({ row: { name } }) => {
        return (
          <Grid spacing={3} container>
            <Grid xs={1}>
              <Business />
            </Grid>
            <Grid xs={8}>
              <Typography style={{ marginTop: 17, fontSize: 12 }}>
                {name}
              </Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
    },
    { field: 'email', headerName: 'Client email', flex: 1 },
    { field: 'number', headerName: 'Head office number', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'Client since',
      flex: 1,
      renderCell: ({ row: { createdAt } }) => {
        return (
          <Typography style={{ marginTop: 17, fontSize: 12 }}>
            {moment(createdAt).format('ll')}
          </Typography>
        );
      },
    },
    {
      field: 'id',
      headerName: 'View',
      renderCell: ({ row: { id } }) => {
        return (
          <Button
            sx={{
              color: colors.grey[100],
            }}
            onClick={() => navigate(`/client/${id}`)}
          >
            <ChevronRight />
          </Button>
        );
      },
    },
  ];
  return (
    <Box
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold',
          color: colors.grey[500],
        },
        '& .MuiDataGrid-virtualScroller': {
          backgroundColor: colors.grey[900],
        },
        '& .MuiDataGrid-main': {
          backgroundColor: colors.blueAccent[100],
        },
        '& .MuiDataGrid-footerContainer': {
          bordertop: 'none',
          backgroundColor: colors.grey[700],
        },
      }}
    >
      <DataGrid rows={clients} columns={columns} />
    </Box>
  );
};

export default ClientGrid;
