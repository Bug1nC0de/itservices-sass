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
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import moment from 'moment';
import { setTodoDeadline } from '../../api/main/todoApi';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';

const MonthlyDeadline = ({ deadlineType }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  let colors = tokens(theme.palette.mode);

  const [deadline, setDeadline] = useState(new Date());

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

  const monthlySelected = {
    color: colors.redAccent[600],
    fontStyle: 'italic',
    fontWeight: 'bold',
  };

  const confirmDeadline = () => {
    let myDeadline = moment(deadline).format('Do');
    const todoDeadline = {
      type: 'Monthly',
      deadline: myDeadline,
    };
    setTodoDeadline({ todoDeadline });
    handleClose();
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        sx={
          deadlineType === 'Monthly' ? { ...monthlySelected } : { ...btnStyle }
        }
        fullWidth
      >
        Monthly Deadline
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
              <Typography variant="h6">Select monthly dealine date </Typography>
              <Divider
                variant="middle"
                sx={{ marginBottom: '15px', marginTop: '5px' }}
              />
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                inline
              />
            </Container>

            <Typography>
              Currently set to the {moment(deadline).format('Do')} of every
              month
            </Typography>

            <Button
              sx={{ marginTop: '10px' }}
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

export default MonthlyDeadline;
