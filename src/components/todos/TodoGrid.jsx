import { useTheme, Button, Box, Typography } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment/moment';

const TodoGrid = ({ todos }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const navToToDO = (id) => {
    navigate(`/todo/${id}`);
  };

  const columns = [
    { field: 'todoName', headerName: 'Name', flex: 1 },
    { field: 'todoDescription', headerName: 'Description', flex: 1 },
    {
      field: 'type',
      headerName: 'Type',
      renderCell: ({ row: { deadline } }) => {
        return (
          <Typography style={{ marginTop: 17, fontSize: 12 }}>
            {deadline.type}
          </Typography>
        );
      },
    },
    {
      field: 'deadline',
      headerName: 'Deadline',
      renderCell: ({ row: { deadline } }) => {
        return (
          <Typography style={{ marginTop: 17, fontSize: 12 }}>
            {moment(deadline.deadline).format('ll')}
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
            onClick={() => navToToDO(id)}
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
      <DataGrid rows={todos} columns={columns} />
    </Box>
  );
};

export default TodoGrid;
