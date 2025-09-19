import { useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProjects } from '../../api/main/projectApi';
import StatCard from '../common/StatCard';
import ProjectGrid from './ProjectGrid';

const MainProjects = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { projects } = useSelector((state) => state.projects);

  const getActiveProjects = () => {
    getProjects();
  };

  useEffect(() => {
    getActiveProjects();
  }, []);

  if (!projects) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Active Projects" count={0} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Whats Next" count={0} />
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          onClick={() => navigate('/closed-tickets')}
        >
          <StatCard title="Completed Projects" count={0} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography
            variant="h5"
            style={{
              marginTop: 20,
              marginBottom: 10,
              color: colors.redAccent[500],
            }}
          >
            Active Projects
          </Typography>
          {!projects ? (
            <CircularProgress />
          ) : projects.length > 0 ? (
            <ProjectGrid projects={projects} />
          ) : (
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              No Projects created
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h6"
            style={{
              textAlign: 'center',
              marginTop: 10,
              color: colors.blueAccent[500],
            }}
          >
            Whats Next?
          </Typography>

          {/* {projects && projects.length > 0 ? (
            SHOW WHATS NEXT
          )} */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainProjects;
