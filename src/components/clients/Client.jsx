import {
  Box,
  Grid,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft,
  ContentPasteSearchOutlined,
  PersonSearch,
  MailOutlineSharp,
  AddLocationSharp,
  LocalPhoneSharp,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { tokens } from '../../theme';
import { useParams } from 'react-router-dom';
import {
  fetchClient,
  getBranches,
  getDepartments,
} from '../../api/main/clientApi';
import { fetchClientTickets } from '../../api/main/helpdeskApi';
import { clientProjects } from '../../api/main/projectApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AddProject from '../projects/AddProject';
import AddUser from '../common/modals/AddUser';
import { useNavigate } from 'react-router-dom';
import UserGrid from './UserGrid';
import InClientTicket from './InClientTicket';
import InClientProject from './InClientProject';
import BranchItem from '../management/BranchItem';
import DepartmentItem from '../management/DepartmentItem';
import CreateBranch from '../management/CreateBranch';
import CreateDepartment from '../management/CreateDepartment';

const Client = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [showTickets, setShowTickets] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const { client_tickets } = useSelector((state) => state.helpdesk);
  const { client, users, branches, departments } = useSelector(
    (state) => state.clients
  );
  const { userInfo } = useSelector((state) => state.auth);
  const { client_projects } = useSelector((state) => state.projects);
  const getClient = async () => {
    await fetchClient(clientId);
    await fetchClientTickets(clientId);
    await getBranches(clientId);
    await getDepartments(clientId);
    clientProjects(clientId);
  };

  useEffect(() => {
    if (clientId) {
      getClient();
    }
  }, [clientId]);

  if (!client || !departments || !branches) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container style={{ marginTop: -15 }}>
        <Grid size={{ xs: 1 }}>
          <Button sx={{ color: colors.grey[500] }} onClick={() => navigate(-1)}>
            <ChevronLeft />
          </Button>
        </Grid>
        <Grid size={{ xs: 7 }}>
          <Typography variant="h4">{client.name}</Typography>
        </Grid>
        <Grid size={{ xs: 1 }}>
          <Button size="small" variant="outlined" color="secondary">
            <ContentPasteSearchOutlined />
          </Button>
        </Grid>
        <Grid size={{ xs: 1 }}>
          <AddUser
            clientId={clientId}
            client={client}
            createAnewUser={() => console.log('Create user')}
          />
        </Grid>
        <Grid size={{ xs: 1 }}>
          <AddProject clientId={clientId} client={client} userInfo={userInfo} />
        </Grid>
        <Grid size={{ xs: 1 }}>
          <Button
            size="small"
            variant="outlined"
            sx={{
              color: colors.blueAccent[200],
              borderColor: colors.blueAccent[200],
            }}
          >
            <PersonSearch />
          </Button>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ mb: '10px', mt: '10px' }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 8 }} style={{ marginTop: 10 }}>
          <Typography
            variant="h5"
            sx={{
              ml: '10px',
              color: colors.blueAccent[500],
              fontWeight: 'bold',
            }}
          >
            Users:
          </Typography>
          {users.length === 0 ? (
            <Alert severity="warning" style={{ marginTop: '10px' }}>
              Client has no users...
            </Alert>
          ) : (
            <UserGrid users={users} />
          )}
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Typography variant="h5" sx={{ color: colors.blueAccent[100] }}>
            Client Info:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <MailOutlineSharp />
              </ListItemIcon>
              <ListItemText primary={`${client.email}`} />
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
              <ListItemIcon>
                <AddLocationSharp />
              </ListItemIcon>
              <ListItemText primary={`${client.address}`} />
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
              <ListItemIcon>
                <LocalPhoneSharp />
              </ListItemIcon>
              <ListItemText primary={`${client.number}`} />
            </ListItem>
          </List>
          <Grid container>
            <Grid size={{ xs: 10 }}>
              <Typography variant="h5" sx={{ color: colors.blueAccent[100] }}>
                Departments
              </Typography>
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
          <Divider variant="middle" />
          <Grid container style={{ marginTop: '20px' }}>
            <Grid size={{ xs: 10 }}>
              <Typography variant="h5" sx={{ color: colors.blueAccent[100] }}>
                Branches
              </Typography>
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
          <Divider variant="middle" />

          <Grid container>
            <Grid size={{ xs: 11 }}>
              <Typography variant="h5" sx={{ color: colors.blueAccent[100] }}>
                Tickets:
              </Typography>
            </Grid>
            <Grid size={{ xs: 1 }}>
              {showTickets ? (
                <KeyboardArrowUp
                  style={{ marginTop: '10px' }}
                  onClick={() => setShowTickets(false)}
                />
              ) : (
                <KeyboardArrowDown
                  style={{ marginTop: '10px' }}
                  onClick={() => setShowTickets(true)}
                />
              )}
            </Grid>
          </Grid>
          {client_tickets === null ? (
            <CircularProgress />
          ) : showTickets ? (
            client_tickets.length === 0 ? (
              <Typography style={{ marginTop: '10px' }}>No Tickets</Typography>
            ) : (
              client_tickets.map((ticket) => (
                <InClientTicket
                  key={ticket.id}
                  ticket={ticket}
                  clientId={clientId}
                />
              ))
            )
          ) : (
            ''
          )}
          <Divider variant="middle" />
          <Grid container>
            <Grid size={{ xs: 11 }}>
              <Typography variant="h5" sx={{ color: colors.blueAccent[100] }}>
                Projects:
              </Typography>
            </Grid>
            <Grid size={{ xs: 1 }}>
              {showProjects ? (
                <KeyboardArrowUp
                  style={{ marginTop: '10px' }}
                  onClick={() => setShowProjects(false)}
                />
              ) : (
                <KeyboardArrowDown
                  style={{ marginTop: '10px' }}
                  onClick={() => setShowProjects(true)}
                />
              )}
            </Grid>
          </Grid>
          {!client_projects ? (
            <CircularProgress />
          ) : showProjects ? (
            client_projects.length === 0 ? (
              <Typography style={{ marginTop: '10px' }}>No Projects</Typography>
            ) : (
              client_projects.map((project) => (
                <InClientProject
                  key={project.id}
                  project={project}
                  clientId={clientId}
                />
              ))
            )
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Client;
