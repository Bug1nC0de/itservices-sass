import { Alert, Box, Button, Grid, IconButton, Modal } from '@mui/material';
import { CheckCircleOutline, RateReview } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

const TaskComplete = ({
  task,
  doneTask,
  taskIsNotDone,
  alert,
  setComplete,
  finalTask,
}) => {
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (updating && alert) {
      setUpdating(false);
      handleClose();
    }
  }, [updating, alert]);
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

  const taskIsDone = async () => {
    setUpdating(true);
    await doneTask(task);
  };

  const taskNotDone = () => {
    setUpdating(true);
    taskIsNotDone(task);
  };

  return (
    <>
      {setComplete ? (
        <>
          <IconButton edge="end" color="warning" onClick={handleOpen}>
            <CheckCircleOutline />
          </IconButton>
          <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...style }}>
              <Grid item>
                <Alert
                  icon={false}
                  variant="outlined"
                  severity="info"
                  sx={{ marginBottom: '20px' }}
                >
                  Are you done with {task.title}
                </Alert>
                {finalTask && (
                  <Alert severity="warning" sx={{ marginBottom: '20px' }}>
                    This the final task once its done the ToDo will be complete
                  </Alert>
                )}
                <Grid container>
                  <Grid item>
                    {updating ? (
                      <LoadingButton>Updating...</LoadingButton>
                    ) : (
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => taskIsDone()}
                      >
                        Complete
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Button onClick={handleClose} color="error">
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </>
      ) : (
        <>
          <IconButton edge="end" onClick={handleOpen}>
            <RateReview />
          </IconButton>
          <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...style }}>
              <Grid item>
                <Alert
                  icon={false}
                  variant="outlined"
                  severity="info"
                  sx={{ marginBottom: '20px' }}
                >
                  Review {task.title}
                </Alert>

                <Grid container>
                  <Grid item>
                    {updating ? (
                      <LoadingButton>Updating...</LoadingButton>
                    ) : (
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => taskNotDone()}
                      >
                        Not Complete
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Button onClick={handleClose} color="error">
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default TaskComplete;
