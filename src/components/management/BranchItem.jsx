import { Typography, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import BusinessIcon from '@mui/icons-material/Business';

const BranchItem = ({ branch }) => {
  let navigate = useNavigate();

  return (
    <>
      <Grid
        onClick={() => navigate(`/user/company-branch/${branch.id}`)}
        container
      >
        <Grid size={{ xs: 12 }}>
          <BusinessIcon />
        </Grid>
        <Grid size={{ xs: 12 }} x>
          <Typography>{branch.name}</Typography>
        </Grid>
        <Divider sx={{ marginTop: '12px' }} />
      </Grid>
    </>
  );
};

export default BranchItem;
