import {
  CircularProgress,
  Typography,
  Container,
  Divider,
  Grid,
  Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Users from './Users';
import {
  getTechs,
  getITBranches,
  getITdepartments,
} from '../../api/main/techApi';
import CreateDepartment from './CreateDepartment';
import DepartmentItem from './DepartmentItem';
import CreateBranch from './CreateBranch';
import BranchItem from './BranchItem';
import AddUser from '../common/modals/AddUser';
import { useEffect } from 'react';

const MainManagement = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { users, branches, departments } = useSelector((state) => state.user);

  const getManagement = async () => {
    await getTechs();
    await getITBranches();
    await getITdepartments();
  };

  useEffect(() => {
    getManagement();
  }, []);

  if (!users || !branches || !departments) {
    return <CircularProgress />;
  }

  const createAnewUser = async ({
    name,
    surname,
    position,
    email,
    cellphone,
    password,
    createdAt,
  }) => {
    console.log({
      name,
      surname,
      position,
      email,
      cellphone,
      password,
      createdAt,
    });
  };
  return (
    <Container>
      <Typography variant="h6" style={{ marginTop: -15 }}>
        Management
      </Typography>
      <Divider
        variant="middle"
        sx={{ marginBottom: '5px', marginTop: '5px' }}
      />
      <Grid container style={{ justifyContent: 'space-between' }}>
        <Grid size={{ xs: 11 }}>
          <Typography variant="h6" sx={{ marginTop: '5px' }}>
            Current staff
          </Typography>
        </Grid>
        <Grid size={{ xs: 1 }}>
          <AddUser createAnewUser={createAnewUser} />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: '20px' }} spacing={2}>
        <Grid size={{ xs: 7 }}>
          {users !== null && users.length === 0 ? (
            <Alert>No users...</Alert>
          ) : (
            users.map((user) => <Users key={user.id} user={user} />)
          )}
        </Grid>
        <Grid size={{ xs: 5 }}>
          <Grid container>
            <Grid size={{ xs: 10 }}>
              <Typography>Departments</Typography>
            </Grid>
            <Grid size={{ xs: 2 }} style={{ marginTop: -15 }}>
              <CreateDepartment user={userInfo} />
            </Grid>
          </Grid>
          {departments.length === 0 ? (
            <Alert severity="warning">No departments</Alert>
          ) : (
            departments.map((dep) => (
              <DepartmentItem key={dep.id} department={dep} />
            ))
          )}
          <Grid container style={{ marginTop: '20px' }}>
            <Grid size={{ xs: 10 }}>
              <Typography>Branches</Typography>
            </Grid>
            <Grid size={{ xs: 2 }} style={{ marginTop: -15 }}>
              <CreateBranch user={userInfo} />
            </Grid>
          </Grid>
          {branches.length === 0 ? (
            <Alert severity="warning" sx={{ marginTop: '5px' }}>
              No branches
            </Alert>
          ) : (
            branches.map((branch) => (
              <BranchItem key={branch.id} branch={branch} />
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainManagement;
