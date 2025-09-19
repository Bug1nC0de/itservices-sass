import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Typography, Button } from '@mui/material';
import { tokens } from '../../theme';
import { ChevronRight } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';

const SalesGrid = ({ sales }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: 'client',
      headerName: 'Client',
      flex: 1,
      renderCell: ({ row: client }) => {
        return (
          <Typography style={{ marginTop: 17, fontSize: 12 }}>
            {client.name}
          </Typography>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'stage',
      headerName: 'Stage',
      flex: 1,
    },
    {
      field: 'desc',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
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
      flex: 1,
      renderCell: ({ row: { id } }) => {
        return (
          <Button
            sx={{
              borderColor: colors.grey[100],
            }}
            onClick={() => navigate(`/lead-info/${id}`)}
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
      <DataGrid rows={sales} columns={columns} />
    </Box>
  );
};

export default SalesGrid;
