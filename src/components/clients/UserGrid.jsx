import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Button } from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid } from '@mui/x-data-grid';
import { ArrowForwardIos } from '@mui/icons-material';

const UserGrid = ({ users }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'surname', headerName: 'Surname', flex: 1 },
    { field: 'position', headerName: 'Position', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'cellphone', headerName: 'Contact details', flex: 1 },
    {
      field: 'id',
      headerName: 'View',
      renderCell: ({ row: { id } }) => {
        return (
          <Button
            sx={{
              color: colors.grey[500],
            }}
            onClick={() => navigate(`/user/${id}`)}
          >
            <ArrowForwardIos />
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
      <DataGrid rows={users} columns={columns} />
    </Box>
  );
};

export default UserGrid;
