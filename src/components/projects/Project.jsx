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
  IconButton,
  CardContent,
  CardMedia,
  LinearProgress,
} from '@mui/material';
import { ChevronLeft, DoneAll } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactMediaRecorder } from 'react-media-recorder';
import { toast } from 'react-toastify';
import {
  getProject,
  fetchProjectNext,
  fetchProjectTexts,
  fetchProjectMilestones,
  fetchFeatureReq,
  sendProjectText,
  deleteText,
  reactToText,
} from '../../api/main/projectApi';
import { fetchClient } from '../../api/main/clientApi';
import { uploadFile, clearFileUrl } from '../../api/storageApi';
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import moment from 'moment';
import Texts from '../common/Texts';
import CancelIcon from '@mui/icons-material/Cancel';
import MilestoneInfo from './MiletoneInfo';
import CompleteNext from './CompleteNext';
import AddNext from './AddNext';
import CompleteProject from './CompleteProject';
import SelectProjectUsers from './SelectProjectUsers';
import SendMessageComponent from '../common/SendMessageComponent';

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
  const [replyTo, setReplyTo] = useState(null);
  const [replyToVoice, setReplyVoice] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [sending, setSending] = useState(false);
  const scroll = useRef();
  const { file_url } = useSelector((state) => state.storage);

  const { status, startRecording, stopRecording, previewAudioStream } =
    useReactMediaRecorder({
      audio: true,
      askPermissionOnMount: true,
      onStop: (blobUrl, blob) => {
        setAudioURL(blobUrl);
        setAudioBlob(blob);
      },
    });
  const toggleRecording = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };

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

  useEffect(() => {
    if (file_url) {
      let authorId = userInfo.id;
      let imgUrl = !audioBlob ? file_url.url : null;
      let msg = audioBlob ? file_url.url : text;
      let authorName = userInfo.name;
      let createdAt = moment().format();
      let projectId = id;
      let replyText = replyTo && replyTo;
      sendProjectText({
        text: msg,
        imgUrl,
        authorId,
        authorName,
        projectId,
        createdAt,
        replyTo: replyText,
      });
      clearFileUrl();
      setAudioBlob(null);
      setAudioURL('');
      setText('');
      setSending(false);
    }
  }, [file_url]);

  if (!project || proUser === null) {
    return <CircularProgress />;
  }
  const creation = moment(project.createdAt).format('ll');

  const scrollToText = (textId) => {
    const element = document.getElementById(textId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleScroll = (text) => {
    if (texts) {
      if (scroll.current) {
        scroll.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setReplyTo(text);
    if (text.text.length === 0) return;
    const audioChecker = text.text.split('=');
    if (audioChecker.length === 1) return;
    const check = audioChecker[1].split('&');
    const loot = check[0];
    if (loot === 'media') {
      setReplyVoice(true);
    }
  };

  const onEmojiSelect = (emoji) => {
    let txt = text + emoji;
    setText(txt);
  };

  const onSubmit = async (e) => {
    if (sending) return;
    e.preventDefault();
    if (audioBlob) {
      setSending(true);
      const audioFile = new File([audioBlob], `voiceNote_${Date.now()}.webm`, {
        type: 'audio/webm',
      });
      uploadFile({ file: audioFile, type: 'projects' });
    } else if (text.trim() !== '') {
      setSending(true);
      let authorId = userInfo.id;
      let authorName = userInfo.name;
      let createdAt = moment().format();
      let projectId = id;
      let replyText = replyTo && replyTo;
      let imgUrl = null;
      try {
        await sendProjectText({
          text,
          imgUrl,
          authorId,
          authorName,
          projectId,
          createdAt,
          replyTo: replyText && replyText,
        });
        setText('');
        setReplyTo(null);
        setSending(false);
      } catch (error) {
        console.error('Error Sending message: ', error);
      }
    } else {
      return toast.error('Cannot send a blank text');
    }
  };

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
        <Grid size={{ md: 3, xs: 12 }}>
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
                <CompleteNext
                  next={nxt}
                  key={nxt.id}
                  projectId={id}
                  createdBy={project.createdBy}
                />
              ))
            )}
          </List>

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
        <Grid size={{ md: 5, xs: 12 }}>
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
          <Paper
            elevation={4}
            sx={{ display: 'flex', flexDirection: 'column', height: '78vh' }}
          >
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <List id="chat-messages" disablePadding>
                {!texts ? (
                  <CircularProgress />
                ) : texts.length === 0 ? (
                  <ListItem disableGutters sx={{ px: 2, py: 1 }}>
                    No texts
                  </ListItem>
                ) : (
                  texts.map((t) => (
                    <Texts
                      key={t.id}
                      text={t}
                      userId={userInfo.id}
                      toggleScroll={toggleScroll}
                      scrollToText={scrollToText}
                      reactToText={reactToText}
                      deleteText={deleteText}
                    />
                  ))
                )}
                <div ref={scroll} />
              </List>
            </Box>
            {replyTo && (
              <Box sx={{ position: 'relative' }}>
                <CardContent
                  sx={{
                    backgroundColor: colors.grey[700],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {replyToVoice ? (
                    <audio
                      src={replyTo.text}
                      controls
                      style={{
                        width: '95%',
                        borderRadius: 999,
                        backgroundColor: 'rgba(70, 62, 62, 0.34)',
                      }}
                    />
                  ) : (
                    <Typography sx={{ color: 'white' }}>
                      {replyTo.text.length > 0 ? replyTo.text : 'Photo'}
                    </Typography>
                  )}
                  {replyTo.imgUrl && (
                    <CardMedia
                      component="img"
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        ml: 2,
                      }}
                      image={replyTo.imgUrl}
                      alt="Reply image"
                    />
                  )}
                </CardContent>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    color: 'white',
                  }}
                  onClick={() => {
                    setReplyVoice(false);
                    setReplyTo(null);
                  }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            {sending && <LinearProgress color="success" />}
            {complete ? (
              'Project is complete...'
            ) : (
              <SendMessageComponent
                onSubmit={onSubmit}
                text={text}
                toggleRecording={toggleRecording}
                status={status}
                colors={colors}
                previewAudioStream={previewAudioStream}
                audioURL={audioURL}
                setText={setText}
                onEmojiSelect={onEmojiSelect}
                uploadFile={uploadFile}
                setAudioBlob={setAudioBlob}
                setAudioURL={setAudioURL}
                setSending={setSending}
                type="projects"
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Project;
