import {
  Box,
  Grid,
  useTheme,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  fetchTodos,
  fetchCompleteTodos,
  fetchAssignedTodos,
} from '../../api/main/todoApi';
import { useSelector } from 'react-redux';
import StatCard from '../common/StatCard';
import { tokens } from '../../theme';
import { useEffect } from 'react';
import TodoGrid from './TodoGrid';

const MainTodos = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { userInfo } = useSelector((state) => state.auth);
  const { myTodos, assignedToDos, doneTodos } = useSelector(
    (state) => state.todos
  );

  const fetchTodoDash = async () => {
    const techId = userInfo.credentials;
    await fetchTodos(techId);
    await fetchCompleteTodos(techId);
    await fetchAssignedTodos(techId);
  };

  useEffect(() => {
    if (userInfo) {
      fetchTodoDash();
    }
  }, [userInfo]);

  if (!myTodos || !assignedToDos || !doneTodos) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Your Todos" count={myTodos.length} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Assigned Todos" count={assignedToDos.length} />
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          onClick={() => navigate('/complete-todos')}
        >
          <StatCard title="Completed Todos" count={doneTodos.length} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h5"
            style={{
              marginTop: 20,
              marginBottom: 10,
              color: colors.blueAccent[500],
            }}
          >
            Your Todos
          </Typography>
          {myTodos.length > 0 ? (
            <TodoGrid todos={myTodos} />
          ) : (
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              No Todos
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h5"
            style={{
              marginTop: 20,
              marginBottom: 10,
              color: colors.blueAccent[500],
            }}
          >
            Assigned Todos
          </Typography>
          {assignedToDos.length > 0 ? (
            <TodoGrid todos={assignedToDos} />
          ) : (
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              No Todos
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainTodos;
