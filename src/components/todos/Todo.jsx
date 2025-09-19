import {
  Box,
  CircularProgress,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeftOutlined, SendOutlined, Remove } from '@mui/icons-material';
import { tokens } from '../../theme';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Text from '../common/Texts';
import AddTask from './AddTask';
import TaskComplete from './TaskComplete';
import TheTimer from './TheTimer';
import ListOfTechs from '../management/ListOfTechs';
import {
  fetchTodo,
  updateCollab,
  removeFromCollab,
  theTaskList,
  theCollab,
  setTaskAsComplete,
  setTaskAsInComplete,
  sendText,
} from '../../api/main/todoApi';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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

  if (!myTodo) {
    return <CircularProgress />;
  }

  const removeFromTaskArr = (task) => {
    let taskId = task.id;
    const myArr = myTodo.taskList.filter((task) => {
      return task.id !== taskId;
    });

    theTaskList({ myArr, todoId });
  };

  const addToTaskArr = (title) => {
    const myArr = myTodo.taskList;
    const id = uuidv4();

    const newTask = {
      done: false,
      id,
      complete: false,
      title: title,
    };

    myArr.push(newTask);
    theTaskList({ myArr, todoId });
  };

  const doneTask = async (task) => {
    const res = await setTaskAsComplete({ todoId, task, finalTask });
    if (res !== undefined) {
      navigate(`/tech/tech-todo/${res}`);
    }
  };

  const taskIsNotDone = (task) => {
    setTaskAsInComplete({ todoId, task, todoComplete });
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
      let arr = collabCacheAdd;
      arr.push(tech);
      updateCollab(arr);
    }
  };

  const removeTech = (techId) => {
    //Check to see if tech is part of orignal team//
    const loot = collabCacheAdd.filter((collab) => {
      let id = collab.id;
      return id !== techId;
    });
    removeFromCollab(loot);
    //just remove from add cache//
    const arr = collabCacheAdd.filter((tech) => {
      let id = tech.id;
      return id !== techId;
    });
    updateCollab(arr);
  };

  const upadateMyCollab = () => {
    let myArr = collabCacheAdd;
    theCollab({ myArr, todoId });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (text === '') return toast.error('Cannot send a blank message!');
    let authorId = userInfo.id;
    let authorName = userInfo.name;
    let createdAt = moment().format();
    sendText({ authorId, authorName, createdAt, todoId, text });
    setText('');
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
          <Box>
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
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
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
        <Grid size={{ xs: 12, md: 4 }}>
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
                  upadateMyCollab={upadateMyCollab}
                  collab={collabCacheAdd}
                />
              )}
            </Grid>
          </Grid>
          <Paper>
            <Box p={3} size={{ xs: 12 }}>
              <Grid container spacing={4}>
                <Grid id="chat-grid" item>
                  <List id="chat-messages">
                    {texts.length === 0
                      ? 'no texts'
                      : texts.map((text) => (
                          <Text
                            key={text.id}
                            text={text}
                            techId={userInfo.id}
                          />
                        ))}
                    <ListItem></ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
            {todoComplete ? (
              'Todo is complete...'
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

export default Todo;
