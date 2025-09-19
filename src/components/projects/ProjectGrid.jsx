import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';

const ProjectGrid = ({ projects }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const columns = [
    { field: 'clientName', headerName: 'Client', flex: 1 },
    { field: 'name', headerName: 'Project', flex: 1 },
    { field: 'desc', headerName: 'Description', flex: 1 },
    {
      field: 'id',
      headerName: 'View',
      renderCell: ({ row: { id } }) => {
        return (
          <Button
            onClick={() => navigate(`/project/${id}`)}
            sx={{
              color: colors.grey[500],
            }}
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
      <DataGrid rows={projects} columns={columns} />
    </Box>
  );
};

export default ProjectGrid;
