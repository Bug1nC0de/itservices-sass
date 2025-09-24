import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { setTodoDeadline } from '../../api/main/todoApi';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';

const OnceOffDeadline = ({ deadlineType }) => {
  const [open, setOpen] = useState(false);
  const [deadline, setDeadline] = useState(new Date());
  let theme = useTheme();
  let colors = tokens(theme.palette.mode);
  const [days, setDays] = useState(0);
  const [weeks, setWeeks] = useState(0);
  const [months, setMonths] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (deadline) {
      let a = moment();
      let b = moment(deadline);
      let days = b.diff(a, 'days');
      let weeks = b.diff(a, 'weeks');
      let months = b.diff(a, 'months');

      if (months > 0) {
        setMonths(months);
        setDays(0);
        setWeeks(0);
      } else if (weeks > 0) {
        setWeeks(weeks);
        setDays(0);
        setMonths(0);
      } else if (days > 0) {
        setDays(days);
        setMonths(0);
        setWeeks(0);
      }
    }
  }, [deadline]);

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
    color: colors.redAccent[600],
    fontStyle: 'italic',
    fontWeight: 'bold',
  };

  const confirmDeadline = () => {
    let myDeadline = moment(deadline).format();
    const todoDeadline = {
      type: 'Once',
      deadline: myDeadline,
    };
    setTodoDeadline({ todoDeadline });
    handleClose();
  };
  return (
    <>
      <Button
        sx={deadlineType === 'Once' ? { ...activeBtn } : { ...btnStyle }}
        onClick={handleOpen}
        fullWidth
      >
        Once Off Deadline
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
              Give your todo a deadline
            </Alert>

            <Container>
              <Typography variant="h6">Deadline date </Typography>
              <Divider
                variant="middle"
                sx={{ marginBottom: '15px', marginTop: '5px' }}
              />
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                minDate={new Date()}
                inline
              />
            </Container>

            <Typography>
              Current deadline: {moment(deadline).format('MMMM Do YYYY')}
            </Typography>
            <Divider
              variant="middle"
              sx={{ marginBottom: '5px', marginTop: '5px' }}
            />
            <Typography>
              {days > 0
                ? `${days} day/s`
                : weeks > 0
                ? `${weeks} week/s`
                : months > 0
                ? `${months} month/s`
                : 'Choose your prefered deadline day'}
            </Typography>

            <Button
              sx={{ marginTop: '10px', bgcolor: '#0096FF' }}
              variant="contained"
              onClick={confirmDeadline}
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

export default OnceOffDeadline;
