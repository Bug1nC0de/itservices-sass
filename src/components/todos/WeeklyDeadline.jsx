import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { setTodoDeadline } from '../../api/main/todoApi';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';

const WeeklyDeadline = ({ deadlineType }) => {
  const [open, setOpen] = useState(false);
  const [deadline, setDeadline] = useState(false);
  const [formError, setFormError] = useState(null);
  const theme = useTheme();
  let colors = tokens(theme.palette.mode);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setDeadline(false);
    setOpen(false);
  };

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

  const btnStyle = {
    color: colors.grey[400],
  };

  const activeBtn = {
    color: colors.grey[600],
    borderColor: colors.grey[600],
  };

  const weeklySelected = {
    color: colors.redAccent[600],
    fontStyle: 'italic',
    fontWeight: 'bold',
  };
  const confirmDeadline = () => {
    if (deadline === false) {
      setFormError('Please select a deadline');
      setTimeout(() => setFormError(null), 4000);
    } else {
      const todoDeadline = {
        type: 'Weekly',
        deadline,
      };
      setTodoDeadline({ todoDeadline });
      handleClose();
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={deadlineType === 'Weekly' ? { ...weeklySelected } : { ...btnStyle }}
        fullWidth
      >
        Weekly Deadline
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid size={{ xs: 12 }} item>
            <Alert
              icon={false}
              variant="outlined"
              severity="info"
              sx={{ marginBottom: '10px' }}
            >
              Give your todo a daily deadline
            </Alert>
            {formError && (
              <Button
                fullWidth
                variant="contained"
                color="error"
                id="error-btn"
              >
                {formError}
              </Button>
            )}
            <Button
              variant={deadline === 'Monday' ? 'outlined' : 'text'}
              onClick={() => setDeadline('Monday')}
              sx={deadline === 'Monday' ? { ...activeBtn } : { ...btnStyle }}
            >
              Monday
            </Button>
            <Button
              variant={deadline === 'Tuesday' ? 'outlined' : 'text'}
              onClick={() => setDeadline('Tuesday')}
              sx={deadline === 'Tuesday' ? { ...activeBtn } : { ...btnStyle }}
            >
              Tuesday
            </Button>
            <Button
              variant={deadline === 'Wednesday' ? 'outlined' : 'text'}
              onClick={() => setDeadline('Wednesday')}
              sx={deadline === 'Wednesday' ? { ...activeBtn } : { ...btnStyle }}
            >
              Wednesday
            </Button>
            <Button
              variant={deadline === 'Thursday' ? 'outlined' : 'text'}
              onClick={() => setDeadline('Thursday')}
              sx={deadline === 'Thursday' ? { ...activeBtn } : { ...btnStyle }}
            >
              Thursday
            </Button>
            <Button
              variant={deadline === 'Friday' ? 'outlined' : 'text'}
              onClick={() => setDeadline('Friday')}
              sx={deadline === 'Friday' ? { ...activeBtn } : { ...btnStyle }}
            >
              Friday
            </Button>

            <Divider
              variant="middle"
              sx={{ marginBottom: '5px', marginTop: '9px' }}
            />

            {deadline ? (
              <Typography variant="button" color="green">
                {deadline} weekly selected
              </Typography>
            ) : (
              <Typography color="orange">
                Select one of the days above...
              </Typography>
            )}

            <Button
              sx={{ marginTop: '10px', bgcolor: '#0096FF' }}
              onClick={confirmDeadline}
              variant="contained"
              fullWidth
            >
              Set Todo deadline
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default WeeklyDeadline;
