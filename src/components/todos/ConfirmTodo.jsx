import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Typography,
  LinearProgress,
} from '@mui/material';
import { createTodo } from '../../api/main/todoApi';
import { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

const style = {
  textAlign: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ConfirmTodo = ({
  todoName,
  todoDescription,
  taskList,
  assignedToDo,
  todoDeadline,
  navigateToCreatedToDo,
  userInfo,
}) => {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleOpen = () => {
    if (todoName.length < 3) {
      toast.error('Please give ToDo a name');
    } else if (todoDeadline === null) {
      toast.error('Please set a deadline for your todo');
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  const confirmCreation = async () => {
    let createdBy = {
      name: userInfo.name,
      id: userInfo.credentials,
      webtoken: userInfo.webtoken ?? '',
      phonetoken: userInfo.phonetoken ?? '',
    };
    let assignedTo = assignedToDo;
    let deadline = todoDeadline;
    setCreating(true);
    const todoId = await createTodo({
      todoName,
      todoDescription,
      taskList,
      assignedTo,
      deadline,
      createdBy,
    });
    handleClose();
    navigateToCreatedToDo(todoId);
  };

  return (
    <>
      <Button onClick={handleOpen} color="primary" variant="contained">
        Create
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid>
            <Typography color="green" variant="h5">
              Summary of ToDo
            </Typography>
            <Typography color="grey" variant="caption">
              Once you happy with your ToDo click create...
            </Typography>
            <Divider
              variant="middle"
              sx={{ marginBottom: '15px', marginTop: '5px', color: 'green' }}
            />
            <Grid container>
              <Grid size={{ xs: 4 }}>
                <Typography>Todo name: </Typography>
              </Grid>
              <Grid size={{ xs: 5 }}>
                <Typography>{todoName}</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid size={{ xs: 4 }}>
                <Typography>Description:</Typography>
              </Grid>
              <Grid size={{ xs: 5 }}>
                <Typography>{todoDescription}</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid size={{ xs: 4 }}>
                <Typography>Task List:</Typography>
              </Grid>
              <Grid size={{ xs: 5 }}>
                {taskList.length === 0 ? (
                  <Typography color="orange">You have no tasks...</Typography>
                ) : (
                  taskList.map((task, index) => (
                    <Typography key={task.id}>
                      {index + 1}: {task.title}
                    </Typography>
                  ))
                )}
              </Grid>
            </Grid>
            <Grid container>
              <Grid size={{ xs: 4 }}>
                <Typography>Assigned to:</Typography>
              </Grid>
              <Grid size={{ xs: 5 }}>
                {assignedToDo ? (
                  assignedToDo.map((tech) => (
                    <Typography key={tech.id}>{tech.name}</Typography>
                  ))
                ) : (
                  <Typography color="lightblue">
                    This todo is for you
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container>
              <Grid size={{ xs: 4 }}>
                <Typography>Deadline:</Typography>
              </Grid>
              <Grid size={{ xs: 5 }}>
                {todoDeadline && (
                  <Typography>
                    {todoDeadline.type} -{' '}
                    {todoDeadline.type === 'Once'
                      ? `${moment(todoDeadline.deadline).format(
                          'MMMM Do YYYY'
                        )}`
                      : todoDeadline.type === 'Daily'
                      ? `${todoDeadline.deadline}`
                      : todoDeadline.type === 'Weekly'
                      ? `${todoDeadline.deadline}`
                      : todoDeadline.type === 'Monthly'
                      ? `${todoDeadline.deadline}`
                      : ''}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Divider
              variant="middle"
              sx={{ marginBottom: '15px', marginTop: '5px', color: 'green' }}
            />
            {creating ? (
              <LinearProgress color="success" />
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={confirmCreation}
                fullWidth
              >
                Create ToDo
              </Button>
            )}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ConfirmTodo;
