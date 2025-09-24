import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import { setTodoDeadline } from '../../api/main/todoApi';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';

const DailyDeadline = ({ deadlineType }) => {
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

  const dailySelected = {
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
        type: 'Daily',
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
        sx={deadlineType === 'Daily' ? { ...dailySelected } : { ...btnStyle }}
        fullWidth
      >
        Daily Deadline
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Grid size={{ xs: 12 }}>
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
              onClick={() => setDeadline('8:00')}
              variant={deadline === '8:00' ? 'outlined' : 'text'}
              sx={deadline === '8:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              8:00
            </Button>
            <Button
              onClick={() => setDeadline('9:00')}
              variant={deadline === '9:00' ? 'outlined' : 'text'}
              sx={deadline === '9:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              9:00
            </Button>
            <Button
              onClick={() => setDeadline('10:00')}
              variant={deadline === '10:00' ? 'outlined' : 'text'}
              sx={deadline === '10:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              10:00
            </Button>
            <Button
              onClick={() => setDeadline('11:00')}
              variant={deadline === '11:00' ? 'outlined' : 'text'}
              sx={deadline === '11:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              11:00
            </Button>
            <Button
              onClick={() => setDeadline('12:00')}
              variant={deadline === '12:00' ? 'outlined' : 'text'}
              sx={deadline === '12:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              12:00
            </Button>
            <Button
              onClick={() => setDeadline('13:00')}
              variant={deadline === '13:00' ? 'outlined' : 'text'}
              sx={deadline === '13:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              13:00
            </Button>
            <Button
              onClick={() => setDeadline('14:00')}
              variant={deadline === '14:00' ? 'outlined' : 'text'}
              sx={deadline === '14:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              14:00
            </Button>
            <Button
              onClick={() => setDeadline('15:00')}
              variant={deadline === '15:00' ? 'outlined' : 'text'}
              sx={deadline === '15:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              15:00
            </Button>
            <Button
              onClick={() => setDeadline('16:00')}
              variant={deadline === '16:00' ? 'outlined' : 'text'}
              sx={deadline === '16:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              16:00
            </Button>
            <Button
              onClick={() => setDeadline('17:00')}
              variant={deadline === '17:00' ? 'outlined' : 'text'}
              sx={deadline === '17:00' ? { ...activeBtn } : { ...btnStyle }}
            >
              17:00
            </Button>

            <Divider
              variant="middle"
              sx={{ marginBottom: '5px', marginTop: '9px' }}
            />

            {deadline ? (
              <Typography variant="button" color="green">
                {deadline} daily selected
              </Typography>
            ) : (
              <Typography color="orange">
                Select one of the times above...
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

export default DailyDeadline;
