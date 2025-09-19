import {
  CircularProgress,
  Typography,
  Container,
  Divider,
  Grid,
  Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getBranches, getDepartments } from '../../api/users/userApi';
import { useEffect } from 'react';
import AddUser from '../common/modals/AddUser';
import Users from './Users';
import CreateDepartment from './CreateDepartment';
import DepartmentItem from './DepartmentItem';
import CreateBranch from './CreateBranch';
import BranchItem from './BranchItem';

const UserManagement = () => {
  const { client, branches, departments, users } = useSelector(
    (state) => state.user
  );
  const { userInfo } = useSelector((state) => state.auth);

  const getClientInfo = async () => {
    await getBranches(client.id);
    await getDepartments(client.id);
  };

  useEffect(() => {
    if (!branches || !departments) {
      getClientInfo();
    }
  }, [client, branches, departments]);

  if (!client) {
    return <CircularProgress />;
  }

  const createAnewUser = async () => {};

  return (
    <Container>
      <Typography variant="h6">{client.name} management</Typography>
      <Divider
        variant="middle"
        sx={{ marginBottom: '5px', marginTop: '5px' }}
      />

      <Grid container style={{ justifyContent: 'space-between' }}>
        <Grid size={{ xs: 11 }}>
          <Typography variant="h6" sx={{ marginTop: '5px' }}>
            Current users
          </Typography>
        </Grid>
        <Grid size={{ xs: 1 }}>
          <AddUser
            client={client}
            createAnewUser={createAnewUser}
            clientId={client.id}
          />
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
          <Grid container style={{ justifyContent: 'space-between' }}>
            <Grid size={{ xs: 10 }}>
              <Alert
                variant="outlined"
                severity="info"
                style={{ width: '100%' }}
              >
                Departments
              </Alert>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <CreateDepartment clientId={client.id} user={userInfo} />
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
              <Alert
                variant="outlined"
                severity="info"
                style={{ width: '100%' }}
              >
                Branches
              </Alert>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <CreateBranch clientId={client.id} user={userInfo} />
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

export default UserManagement;
