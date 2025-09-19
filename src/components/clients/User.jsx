import {
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Alert,
  Button,
  Box,
  Grid,
  useTheme,
} from '@mui/material';
import { useEffect } from 'react';
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUser } from '../../api/main/clientApi';

const User = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useSelector((state) => state.client);

  const getTheUser = async () => {
    await fetchUser(userId);
  };

  useEffect(() => {
    if (userId) {
      getTheUser();
    }
  }, [userId]);

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid size={1}>
          <Button onClick={() => navigate(-1)} sx={{ color: colors.grey[500] }}>
            <ChevronLeft />
          </Button>
        </Grid>
        <Grid size={5}>
          <Typography
            variant="h5"
            sx={{ color: colors.grey[500], fontWeight: 'bold' }}
          >
            {user.name}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
    </>
  );
};

export default User;
