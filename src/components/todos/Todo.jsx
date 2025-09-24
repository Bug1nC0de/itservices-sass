import {
  Box,
  CircularProgress,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  useTheme,
  CardMedia,
  LinearProgress,
  CardContent,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftOutlined, Remove, Cancel } from '@mui/icons-material';
import { useReactMediaRecorder } from 'react-media-recorder';
import { tokens } from '../../theme';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Texts from '../common/Texts';
import AddTask from './AddTask';
import TaskComplete from './TaskComplete';
import TheTimer from './TheTimer';
import ListOfTechs from '../management/ListOfTechs';
import SendMessageComponent from '../common/SendMessageComponent';
import {
  fetchTodo,
  updateCollab,
  theTaskList,
  theCollab,
  setTaskAsComplete,
  setTaskAsInComplete,
  sendText,
  reactToText,
  deleteText,
} from '../../api/main/todoApi';
import { uploadFile, clearFileUrl } from '../../api/storageApi';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const Todo = () => {
  const { todoId } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [mine, setMine] = useState(false);
  const [todoType, setTodoType] = useState(null);
  const [todoDeadline, setTodoDeadline] = useState(null);
  const [completedTasks, setCompleteTasks] = useState([]);
  const [inCompleteTasks, setInCompleteTasks] = useState([]);
  const [finalTask, setFinalTask] = useState(false);
  const [todoComplete, setTodoComplete] = useState(false);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyToVoice, setReplyVoice] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const navigate = useNavigate();
  const { myTodo, collabCacheAdd, prevTodo, texts } = useSelector(
    (state) => state.todos
  );
  const { userInfo } = useSelector((state) => state.auth);

  const getTodo = async () => {
    await fetchTodo(todoId);
  };

  useEffect(() => {
    if (todoId) {
      getTodo();
    }
  }, [todoId]);

  useEffect(() => {
    if (myTodo) {
      let me = userInfo.credentials;
      let owner = myTodo.createdBy.id;
      if (me === owner) {
        setMine(true);
      } else {
        setMine(false);
      }
      setTodoType(myTodo.deadline.type);
      setTodoDeadline(myTodo.deadline.deadline);
      let todoLength = myTodo.taskList.length;
      const complete = myTodo.taskList.filter((task) => {
        return task.done === true;
      });
      let completeLength = complete.length;
      setCompleteTasks(complete);
      const incomplete = myTodo.taskList.filter((task) => {
        return task.done === false;
      });

      setInCompleteTasks(incomplete);
      let howFar = todoLength - completeLength;
      if (howFar === 1) {
        setFinalTask(true);
        setTodoComplete(false);
      } else if (howFar === 0) {
        setTodoComplete(true);
        setFinalTask(false);
      } else {
        setFinalTask(false);
        setTodoComplete(false);
      }
    }
  }, [myTodo, setCompleteTasks, setInCompleteTasks, setFinalTask, userInfo]);

  useEffect(() => {
    if (file_url) {
      let authorId = userInfo.id;
      let imgUrl = !audioBlob ? file_url.url : null;
      let msg = audioBlob ? file_url.url : text;
      let authorName = userInfo.name;
      let createdAt = moment().format();
      let replyText = replyTo && replyTo;
      sendText({
        text: msg,
        imgUrl,
        authorId,
        authorName,
        todoId,
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
  if (!myTodo) {
    return <CircularProgress />;
  }

  const removeFromTaskArr = async (task) => {
    setLoading(true);
    let taskId = task.id;
    const myArr = myTodo.taskList.filter((task) => {
      return task.id !== taskId;
    });

    const res = await theTaskList({ myArr, todoId });
    if (res === 'success') {
      toast.success('Update Successful');
    } else {
      toast.error('Update failed');
    }
    setLoading(false);
  };

  const addToTaskArr = async (title) => {
    setLoading(true);
    const taskList = myTodo.taskList;
    const id = uuidv4();

    const newTask = {
      done: false,
      id,
      complete: false,
      title: title,
    };

    // Create a new array to avoid mutating taskList
    const myArr = [...taskList, newTask];

    // Update state with the new array
    const res = await theTaskList({ myArr, todoId });
    if (res === 'success') {
      toast.success('Update successful');
    } else {
      toast.error('Update failed');
    }
    setLoading(false);
  };

  const doneTask = async (task) => {
    setLoading(true);
    const res = await setTaskAsComplete({ todoId, task, finalTask });
    if (res !== undefined) {
      navigate(`/todo/${res}`);
    }
    toast.success('Update successful');
    setLoading(false);
  };

  const taskIsNotDone = async (task) => {
    setLoading(true);
    const res = await setTaskAsInComplete({ todoId, task, todoComplete });
    if (res === 'success') {
      toast.success('Update successful');
    } else {
      toast.error('Update failed');
    }
    setLoading(false);
  };

  const addTech = (tech) => {
    //Check to see if tech is part of orignal team//
    const loot = collabCacheAdd.filter((collab) => {
      let id = collab.id;
      let techId = tech.id;
      return id === techId;
    });
    if (loot.length === 0) {
      //If tech is not part of the original team add them to add cache//
      const updatedUserList = [...collabCacheAdd, tech];
      updateCollab(updatedUserList);
    }
  };

  const removeTech = (techId) => {
    // Filter collabCacheAdd to exclude the tech with the given techId
    const updatedCollab = collabCacheAdd.filter((tech) => tech.id !== techId);

    // Update both contexts with the filtered array
    updateCollab(updatedCollab);
  };

  const updateMyCollab = async () => {
    setLoading(true);
    let myArr = collabCacheAdd;
    const res = await theCollab({ myArr, todoId });
    if (res === 'success') {
      toast.success('Update successful');
    } else {
      toast.error('Update failed');
    }
    setLoading(false);
  };

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

  const toggleRecording = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      startRecording();
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
      uploadFile({ file: audioFile, type: 'todos' });
    } else if (text.trim() !== '') {
      setSending(true);
      let authorId = userInfo.id;
      let authorName = userInfo.name;
      let createdAt = moment().format();
      let replyText = replyTo && replyTo;
      let imgUrl = null;
      try {
        await sendText({
          text,
          imgUrl,
          authorId,
          authorName,
          todoId,
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
      <Grid container>
        <Grid size={{ xs: 1 }}>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeftOutlined
              style={{ color: colors.grey[500], fontSize: 25, marginTop: -5 }}
            />
          </Button>
        </Grid>
        <Grid size={{ xs: 7 }}>
          <Typography
            variant="h5"
            sx={{ color: colors.grey[500], fontWeight: 'bold' }}
          >
            {myTodo.todoName}
          </Typography>
        </Grid>
        <Grid size={{ xs: 4 }}>
          {todoComplete ? 'Todo Complete' : 'Todo Still Active'}
        </Grid>
      </Grid>
      <Divider />
      <Grid container>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: colors.greenAccent[400],
              fontWeight: 'bold',
            }}
          >
            Todo details:
          </Typography>
          <Box sx={{ marginBottom: '5px' }}>
            <Grid container>
              <Grid size={{ xs: 6 }}>
                <Typography style={{ fontWeight: 'bold' }}>
                  Description:
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography>{myTodo.todoDescription}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ mb: '15px' }} />
            <Grid container>
              {todoType === 'Once' ? (
                <Grid container>
                  <Grid size={{ xs: 6 }}>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Deadline:
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography>Type:</Typography>
                    <Typography>
                      {todoType} - {moment(todoDeadline).format('ll')}
                    </Typography>
                  </Grid>
                </Grid>
              ) : todoType === 'Daily' ? (
                <Grid container>
                  <Grid size={{ xs: 6 }}>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Deadline:
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography>
                      Type {todoDeadline} - {todoType}
                    </Typography>
                  </Grid>
                </Grid>
              ) : todoType === 'Weekly' ? (
                <Grid container>
                  <Grid size={{ xs: 6 }}>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Deadline:
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    {todoDeadline} - Type: {todoType}
                  </Grid>
                </Grid>
              ) : (
                todoType === 'Monthly' && (
                  <Grid container>
                    <Grid size={{ xs: 6 }}>
                      <Typography style={{ fontWeight: 'bold' }}>
                        Deadline:
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      {todoDeadline} -Type: {todoType}
                    </Grid>
                  </Grid>
                )
              )}
            </Grid>
            <Divider sx={{ mb: '10px' }} />
            <Grid container>
              <Grid size={{ xs: 6 }}>
                <Typography style={{ fontWeight: 'bold' }}>Task is:</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TheTimer deadline={myTodo.deadline} prevTodo={prevTodo} />
              </Grid>
            </Grid>
            <Divider sx={{ mb: '10px' }} />
            <Grid container>
              <Typography style={{ fontWeight: 'bold' }}>Task List</Typography>
              {inCompleteTasks.length === 0 ? (
                <Typography>All tasks are complete...</Typography>
              ) : (
                inCompleteTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    secondaryAction={
                      <>
                        {mine && (
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => removeFromTaskArr(task)}
                          >
                            <Remove />
                          </IconButton>
                        )}
                        <TaskComplete
                          task={task}
                          doneTask={doneTask}
                          taskNotDone={taskIsNotDone}
                          alert={alert}
                          setComplete={true}
                          finalTask={finalTask}
                        />
                      </>
                    }
                  >
                    <ListItemText
                      style={{ width: '100%', maxWidth: '100%' }}
                      primary={`- ${task.title}`}
                    />
                  </ListItem>
                ))
              )}
            </Grid>
            {mine && <AddTask addToTaskArr={addToTaskArr} />}
          </Box>
          {loading && <LinearProgress color="success" />}
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: colors.greenAccent[400], fontWeight: 'bold' }}
          >
            Completed Tasks
          </Typography>
          {completedTasks.length === 0 ? (
            <Typography>You have no completed tasks</Typography>
          ) : (
            completedTasks.map((task) => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <>
                    <TaskComplete
                      task={task}
                      doneTask={doneTask}
                      taskIsNotDone={taskIsNotDone}
                      alert={alert}
                      setComplete={false}
                      finalTask={finalTask}
                    />
                  </>
                }
              >
                <ListItemText primary={`- ${task.title}`} />
              </ListItem>
            ))
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container>
            <Grid size={{ xs: 9 }}>
              <Typography
                variant="h6"
                sx={{ color: colors.greenAccent[400], fontWeight: 'bold' }}
                gutterBottom
              >
                Collaboration
              </Typography>
            </Grid>
            <Grid size={{ xs: 1 }}>
              {myTodo.assignedTo.length === 0 ? (
                <Typography sx={{ mt: '7px' }}>0</Typography>
              ) : (
                <Typography sx={{ mt: '7px' }}>
                  {myTodo.assignedTo.length}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 1 }}>
              {myTodo.createdBy.id === userInfo.credentials && (
                <ListOfTechs
                  addTech={addTech}
                  removeTech={removeTech}
                  updateMyCollab={updateMyCollab}
                  collab={collabCacheAdd}
                />
              )}
            </Grid>
          </Grid>
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
                  <Cancel fontSize="small" />
                </IconButton>
              </Box>
            )}
            {sending && <LinearProgress color="success" />}
            {todoComplete ? (
              'Todo is complete...'
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
                type="todos"
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Todo;
