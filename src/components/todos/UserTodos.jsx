import {
  Container,
  Grid,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Divider,
} from '@mui/material';
import { tokens } from '../../theme';
import { AddBoxOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchMyTodos } from '../../api/users/todoApi';
import StatCard from '../common/StatCard';
import TodoGrid from './TodoGrid';

const UserTodos = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { client } = useSelector((state) => state.user);
  const { myTodos } = useSelector((state) => state.todos);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getMyTodos = async () => {
    await fetchMyTodos(userInfo.credentials);
  };
  useEffect(() => {
    if (!myTodos && userInfo) {
      getMyTodos();
    }
  }, [myTodos, userInfo]);

  if (!myTodos || !client) {
    return <CircularProgress />;
  }

  const navToAddTodo = () => {};
  const navToComplete = () => {};

  return (
    <Container>
      <Grid container>
        <Grid size={{ xs: 8 }}>
          <Typography>{client.name} Todo's</Typography>
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Button
            size="small"
            sx={{ color: colors.grey[200] }}
            onClick={navToAddTodo}
          >
            <AddBoxOutlined />
          </Button>
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Button
            sx={{ color: colors.grey[200], borderColor: colors.grey[200] }}
            onClick={navToComplete}
            variant="outlined"
          >
            Complete Todos
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Open Todo's" count={0} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Unassigned Todo's" count={0} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Completed Todos" count={0} />
        </Grid>
      </Grid>

      <Divider sx={{ marginBottom: '15px', marginTop: '15px' }} />
      <Grid container>
        <Grid size={{ xs: 8 }}>
          <Typography variant="h6">Your TODO's</Typography>
          {myTodos.length === 0 ? (
            <>
              <Typography
                variant="h6"
                style={{
                  textAlign: 'center',
                  marginTop: 5,
                  color: colors.redAccent[600],
                }}
              >
                You have no todos
              </Typography>
            </>
          ) : (
            <TodoGrid todos={myTodos} />
          )}
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Typography>Todo Review</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserTodos;
