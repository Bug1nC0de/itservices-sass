import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import {
  fetchCompleteTodos,
  fetchCompleteAssignedTodos,
} from '../../api/main/todoApi';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import TodoGrid from './TodoGrid';
import { ChevronLeftOutlined } from '@mui/icons-material';

const CompleteTodos = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userInfo } = useSelector((state) => state.auth);
  const { doneTodos, completeAssigned } = useSelector((state) => state.todos);

  const getTodos = async () => {
    const id = userInfo.credentials;
    await fetchCompleteTodos(id);
    await fetchCompleteAssignedTodos(id);
  };

  useEffect(() => {
    if (userInfo) {
      getTodos();
    }
  }, [userInfo]);

  if (!doneTodos || !completeAssigned) {
    return <CircularProgress />;
  }
  return (
    <Box>
      <Grid container style={{ marginTop: -15, marginBottom: 10 }}>
        <Grid size={{ xs: 1 }}>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeftOutlined
              style={{ color: colors.grey[500], fontSize: 25, marginTop: -5 }}
            />
          </Button>
        </Grid>
        <Grid size={{ xs: 10 }}>
          <Typography variant="h6">Complete Todos</Typography>
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
          {doneTodos.length > 0 ? (
            <TodoGrid todos={doneTodos} />
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
          {completeAssigned.length > 0 ? (
            <TodoGrid todos={completeAssigned} />
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

export default CompleteTodos;
