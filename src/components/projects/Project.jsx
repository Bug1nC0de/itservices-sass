import {
  Alert,
  CircularProgress,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  Divider,
  Button,
  useTheme,
  Paper,
  FormControl,
  TextField,
  IconButton,
} from '@mui/material';
import { ChevronLeft, DoneAll, SendOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProject,
  fetchProjectNext,
  fetchProjectTexts,
  fetchProjectMilestones,
  fetchFeatureReq,
} from '../../api/main/projectApi';
import { fetchClient } from '../../api/main/clientApi';
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import moment from 'moment';
import Texts from '../common/Texts';
import MilestoneInfo from './MiletoneInfo';
import CompleteNext from './CompleteNext';
import AddNext from './AddNext';
import CompleteProject from './CompleteProject';
import SelectProjectUsers from './SelectProjectUsers';

const Project = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userInfo } = useSelector((state) => state.auth);

  const { project, project_next, project_milestone, feature, texts } =
    useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.clients);
  const navigate = useNavigate();
  const [pending, setPending] = useState('Start Up...');
  const [complete, setComplete] = useState(false);
  const [proUser, setProUser] = useState(null);
  const [text, setText] = useState('');
  const getTheProject = async () => {
    const projectId = id;
    await getProject(projectId);
    await fetchProjectNext(projectId);
    await fetchProjectMilestones(projectId);
    await fetchFeatureReq(projectId);
    fetchProjectTexts(projectId);
  };

  useEffect(() => {
    if (id) {
      getTheProject();
    }
  }, [id]);

  useEffect(() => {
    if (project) {
      setProUser(project.proUser);
      setComplete(!!project.completedAt);
      fetchClient(project.clientId);
    }
  }, [project]);

  useEffect(() => {
    if (project_next && project_milestone) {
      setPending(
        project_next.length === 0
          ? 'Start Up...'
          : project_next.length === project_milestone.length
          ? false
          : true
      );
    }
  }, [project_next, project_milestone]);

  if (!project || proUser === null) {
    return <CircularProgress />;
  }
  const creation = moment(project.createdAt).format('ll');

  const onSubmit = async () => {};

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* First Column: Project Details */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Grid container>
            <Grid size={{ xs: 1 }}>
              <ChevronLeft onClick={() => navigate(-1)} />
            </Grid>
            <Grid size={{ xs: 11 }}>
              <Typography
                variant="h5"
                sx={{
                  color: colors.grey[500],
                  fontWeight: 'bold',
                  ml: '10px',
                }}
              >
                Project Details
              </Typography>
            </Grid>
          </Grid>

          <List>
            {/* Project Information */}
            <ListItem>
              <Typography>
                <b>Client Name:</b> {project.clientName}
              </Typography>
            </ListItem>
            <Divider />
            <ListItem>
              <Typography>
                <b>Project Name:</b> {project.name}
              </Typography>
            </ListItem>
            <Divider />
            <ListItem>
              <Typography>
                <b>Project Description:</b> {project.desc}
              </Typography>
            </ListItem>
            <Divider />
            <ListItem>
              <Typography>
                <b>Creation Date:</b> {creation}
              </Typography>
            </ListItem>
            <Divider />
            <ListItem>
              <Grid container>
                <Grid size={{ xs: 6 }}>
                  <Typography>
                    <b>Value: R</b> {project.value}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  {complete ? (
                    <Alert icon={false} severity="info">
                      Project Complete
                    </Alert>
                  ) : (
                    <CompleteProject projectId={id} pending={pending} />
                  )}
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            {/* Assigned Users */}
            <ListItem>
              <Grid container>
                <Grid size={{ xs: 6 }}>
                  <Typography>
                    <b>Project User:</b>
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  {proUser.length === 0 && users ? (
                    <SelectProjectUsers users={users} projectId={id} />
                  ) : (
                    <Button color="success" size="small">
                      {proUser.name}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </ListItem>
            <Divider />

            {/* Feature Requests */}
            <Typography
              variant="h6"
              sx={{ color: 'orange' }}
              align="center"
              mt={2}
              gutterBottom
            >
              Feature Requests...
            </Typography>
            {!feature ? (
              <CircularProgress />
            ) : feature.length === 0 ? (
              <>
                <Typography ml={2} mt={2} mb={2}>
                  No Feature Request
                </Typography>
                <Divider />
              </>
            ) : (
              feature.map((f) => (
                <ViewFeature key={f.id} f={f} projectId={id} />
              ))
            )}
          </List>
        </Grid>

        {/* Second Column: What's Next and Milestones */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Grid container>
            <Grid size={{ xs: 8 }}>
              <Typography
                variant="h5"
                sx={{
                  color: colors.grey[500],
                  fontWeight: 'bold',
                  ml: '10px',
                }}
              >
                What's Next
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              {complete ? (
                <Button disableFocusRipple disableRipple>
                  <DoneAll color="warning" />
                </Button>
              ) : (
                <AddNext projectId={id} />
              )}
            </Grid>
          </Grid>

          <List>
            {!project_next ? (
              <CircularProgress />
            ) : project_next.length === 0 ? (
              <Typography>No Next Tasks</Typography>
            ) : (
              project_next.map((nxt) => (
                <CompleteNext next={nxt} key={nxt.id} projectId={id} />
              ))
            )}
          </List>

          <Divider sx={{ mt: 2, mb: 2 }} />

          {/* Milestones under Whats Next */}
          <Typography
            variant="h5"
            sx={{
              color: colors.grey[500],
              fontWeight: 'bold',
              ml: '10px',
              mt: 2,
            }}
          >
            Milestones
          </Typography>
          {!project_milestone ? (
            <CircularProgress />
          ) : project_milestone.length === 0 ? (
            <Typography>No Milestones</Typography>
          ) : (
            project_milestone.map((milestone) => (
              <MilestoneInfo key={milestone.id} milestone={milestone} />
            ))
          )}
        </Grid>

        {/* Third Column: Project Chat */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Typography
            variant="h5"
            sx={{
              color: colors.grey[500],
              fontWeight: 'bold',
              ml: '10px',
              mb: 2,
            }}
          >
            Project Chat
          </Typography>
          <Paper>
            <Box p={3} size={{ xs: 12 }}>
              <Grid container spacing={4}>
                <Grid id="chat-grid">
                  <List id="chat-messages">
                    {!texts || texts.length === 0
                      ? 'no texts'
                      : texts.map((text) => (
                          <Texts
                            key={text.id}
                            text={text}
                            userId={userInfo.id}
                          />
                        ))}
                    <ListItem></ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
            {complete ? (
              'Project is complete...'
            ) : (
              <form onSubmit={onSubmit}>
                <Grid container spacing={1} style={{ padding: 10 }}>
                  <Grid size={{ xs: 10 }}>
                    <FormControl fullWidth>
                      <TextField
                        label="Type your message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 2 }} display="flex" gap={1}>
                    <IconButton size="small" type="submit">
                      <SendOutlined />
                    </IconButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Project;
