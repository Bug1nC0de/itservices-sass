import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Typography, Button } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';

import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import moment from 'moment';

const SupplierGrid = ({ supplers }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'contact',
      headerName: 'Contact',
      flex: 1,
    },
    {
      field: 'vetted',
      headerName: 'Vetted',
      flex: 1,
      renderCell: ({ row: { vetted } }) => {
        return <Typography>{vetted}</Typography>;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      renderCell: ({ row: { createdAt } }) => {
        return <Typography>{moment(createdAt).format('ll')}</Typography>;
      },
    },
    {
      field: 'id',
      headerName: 'View',
      flex: 1,
      renderCell: ({ row: id }) => {
        return (
          <Button
            sx={{
              color: colors.grey[100],
            }}
            onClick={() => navigate(`/supplier/${id}`)}
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
          color: colors.grey[900],
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
      <DataGrid rows={supplers} columns={columns} />
    </Box>
  );
};

export default SupplierGrid;
