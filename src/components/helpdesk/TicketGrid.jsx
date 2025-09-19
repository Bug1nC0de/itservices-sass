import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Typography, Button } from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid } from '@mui/x-data-grid';
import { ChevronRight } from '@mui/icons-material';
import moment from 'moment';

const TicketGrid = ({ helpdesk }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    {
      field: 'ticketNum',
      headerName: 'Ticket Number',
      flex: 1,
    },
    {
      field: 'header',
      headerName: 'Header',
      flex: 1,
    },
    {
      field: 'howbad',
      headerName: 'How Bad',
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'User name',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
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
      field: 'isComplete',
      headerName: 'Status',
      flex: 1,
      renderCell: ({ row: { isComplete } }) => {
        return (
          <Typography style={{ marginTop: 15, fontSize: 12 }}>
            {isComplete ? 'Complete' : 'Active'}
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
            onClick={() => navigate(`/ticket/${id}`)}
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
      <DataGrid rows={helpdesk} columns={columns} />
    </Box>
  );
};

export default TicketGrid;
