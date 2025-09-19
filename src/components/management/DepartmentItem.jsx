import { Typography, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const DepartmentItem = ({ department }) => {
  let navigate = useNavigate();

  return (
    <>
      <Grid
        onClick={() => navigate(`/user/company-department/${department.id}`)}
        container
      >
        <Grid size={{ xs: 2 }}>
          <BusinessCenterIcon />
        </Grid>
        <Grid size={{ xs: 10 }}>
          <Typography>{department.name}</Typography>
        </Grid>
        <Divider sx={{ marginTop: '12px' }} />
      </Grid>
    </>
  );
};

export default DepartmentItem;
