import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  useTheme,
  Container,
} from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import RemoveIcon from '@mui/icons-material/Remove';
import BackSpaceIcon from '@mui/icons-material/ArrowBackIos';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  updateTaskList,
  removeTodoDeadline,
  updateCollab,
} from '../../api/main/todoApi';
import ListOfTechs from '../management/ListOfTechs';
import DailyDeadline from './DailyDeadline';
import WeeklyDeadline from './WeeklyDeadline';
import MonthlyDeadline from './MonthlyDeadline';
import OnceOffDeadline from './OnceOffDeadline';
import ConfirmTodo from './ConfirmTodo';
import AddTask from './AddTask';
import moment from 'moment';

const CreateTodo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [deadlineType, setDeadlineType] = useState(null);
  const [dday, setDday] = useState(null);
  const [todoName, setToDoName] = useState('');
  const [todoDescription, setToDoDescription] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const { taskList, todoDeadline, collabCacheAdd } = useSelector(
    (state) => state.todos
  );

  useEffect(() => {
    if (todoDeadline) {
      setDeadlineType(todoDeadline.type);
      setDday(todoDeadline.deadline);
    } else {
      setDeadlineType(null);
      setDday(null);
    }
  }, [todoDeadline]);

  const addToTaskArr = (title) => {
    const id = uuidv4();

    const newTask = {
      done: false,
      id,
      complete: false,
      title: title,
    };

    // Create a new array to avoid mutating taskList
    const updatedTaskList = [...taskList, newTask];

    // Update state with the new array
    updateTaskList(updatedTaskList);
  };

  const removeFromTaskArr = (taskId) => {
    const newArr = taskList.filter((task) => {
      return task.id !== taskId;
    });

    updateTaskList(newArr);
  };

  const removeDeadline = () => {
    removeTodoDeadline();
  };

  const addUser = (tech) => {
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

  const updateMyCollab = () => {};

  const goBack = () => {
    updateTaskList([]);
    removeDeadline();
    navigate(-1);
  };

  const navigateToCreatedToDo = (todoId) => {
    updateTaskList([]);
    removeTech();
    removeDeadline();
    navigate(`/todo/${todoId}`);
  };
  return (
    <>
      <Grid container>
        <Grid size={{ xs: 1 }}>
          <Button
            size="small"
            sx={{ marginBottom: '8px', color: colors.grey[500] }}
            onClick={goBack}
          >
            <BackSpaceIcon />
          </Button>
        </Grid>
        <Grid size={{ xs: 10 }}>
          <Typography variant="h5" color="green">
            Add Todo
          </Typography>
        </Grid>
        <Grid size={{ xs: 1 }}>
          <ConfirmTodo
            todoName={todoName}
            todoDescription={todoDescription}
            taskList={taskList}
            assignedToDo={collabCacheAdd}
            todoDeadline={todoDeadline}
            navigateToCreatedToDo={navigateToCreatedToDo}
            userInfo={userInfo}
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={2}>
        <Grid size={{ xs: 4 }}>
          <Typography variant="h6" color="grey" gutterBottom>
            Todo details:
          </Typography>

          <Card sx={{ marginBottom: '10px' }}>
            <CardContent>
              <Grid>
                <TextField
                  label="Todo Name"
                  type="text"
                  placeholder="Todo Name"
                  variant="outlined"
                  value={todoName}
                  onChange={(e) => setToDoName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid>
                <TextField
                  label="Todo description"
                  placeholder="Todo description"
                  rows={4}
                  value={todoDescription}
                  onChange={(e) => setToDoDescription(e.target.value)}
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid>
                <AddTask addToTaskArr={addToTaskArr} />
                {taskList.length === 0 ? (
                  <Typography textAlign="center" mt="5px">
                    Add your first task
                  </Typography>
                ) : (
                  taskList.map((task) => (
                    <ListItem
                      key={task.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          color="warning"
                          onClick={() => removeFromTaskArr(task.id)}
                        >
                          <RemoveIcon />
                        </IconButton>
                      }
                    >
                      <IconButton>
                        <RadioButtonUncheckedIcon />
                      </IconButton>

                      <ListItemText primary={`${task.title}`} />
                    </ListItem>
                  ))
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Typography variant="h6" color="grey" gutterBottom sx={{ m: '3px' }}>
            Assign Todo:
          </Typography>
          <Grid size={{ xs: 2 }}>
            <ListOfTechs
              addTech={addUser}
              removeTech={removeTech}
              updateMyCollab={updateMyCollab}
              collab={collabCacheAdd}
            />

            <Divider
              variant="middle"
              sx={{ marginBottom: '5px', marginTop: '5px' }}
            />
          </Grid>
          {collabCacheAdd.length === 0 ? (
            <Typography
              sx={{
                color: colors.grey[500],
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Would you like to collaborate?
            </Typography>
          ) : (
            collabCacheAdd.map((collab) => (
              <Container key={collab.id}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="warning"
                      onClick={() => removeTech(collab.id)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={`${collab.name}`} />
                </ListItem>
              </Container>
            ))
          )}
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Typography variant="h6" color="grey" gutterBottom>
            Todo deadlines:
          </Typography>
          <OnceOffDeadline deadlineType={deadlineType} />
          <Divider
            variant="middle"
            sx={{ marginBottom: '5px', marginTop: '5px' }}
          />
          <DailyDeadline deadlineType={deadlineType} />
          <Divider
            variant="middle"
            sx={{ marginBottom: '5px', marginTop: '5px' }}
          />
          <WeeklyDeadline deadlineType={deadlineType} />
          <Divider
            variant="middle"
            sx={{ marginBottom: '5px', marginTop: '5px' }}
          />
          <MonthlyDeadline deadlineType={deadlineType} />

          <Divider
            variant="middle"
            sx={{ marginBottom: '15px', marginTop: '5px' }}
          />
          {deadlineType && deadlineType === 'Once' ? (
            <ListItem
              secondaryAction={
                <IconButton onClick={removeDeadline} color="warning">
                  <RemoveIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={` Deadline day: ${moment(dday).format(
                  'MMMM Do YYYY'
                )}`}
              />
            </ListItem>
          ) : deadlineType === 'Daily' ? (
            <ListItem
              secondaryAction={
                <IconButton onClick={removeDeadline} color="warning">
                  <RemoveIcon />
                </IconButton>
              }
            >
              <ListItemText primary={`Deadline day: Daily @ ${dday}`} />
            </ListItem>
          ) : deadlineType === 'Weekly' ? (
            <ListItem
              secondaryAction={
                <IconButton onClick={removeDeadline} color="warning">
                  <RemoveIcon />
                </IconButton>
              }
            >
              <ListItemText primary={`Deadline day: Weekly on ${dday}`} />
            </ListItem>
          ) : deadlineType === 'Monthly' ? (
            <ListItem
              secondaryAction={
                <IconButton onClick={removeDeadline} color="warning">
                  <RemoveIcon />
                </IconButton>
              }
            >
              <ListItemText primary={`Deadline day: Monthly on the ${dday}`} />
            </ListItem>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CreateTodo;
