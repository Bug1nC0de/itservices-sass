import { useState, useEffect } from 'react';
import {
  Grid,
  Alert,
  Modal,
  Button,
  Box,
  List,
  ListItemButton,
  ListItem,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';
import { DoneAll, Cancel, Update, BorderColor } from '@mui/icons-material';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ListOfTechs from '../management/ListOfTechs';
import NextPredict from './NextPredict';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const CompleteNext = ({ next }) => {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [howLong, setHowLong] = useState(next.howLong);
  const [assigned, setAssigned] = useState([next.assigned]);

  useEffect(() => {
    if (next.start) {
      setStartDate(new Date(next.start));
    } else {
      setStartDate(new Date());
    }
    if (next.guessEnd) {
      setEndDate(new Date(next.guessEnd));
    }
  }, [next]);

  useEffect(() => {
    if (howLong) {
      let a = howLong.split(' ').shift();
      let end = moment(startDate).add(+a, 'w').format();
      setHowLong(howLong);
      setEndDate(new Date(end));
    }
  }, [howLong, startDate]);

  useEffect(() => {
    if (next.completedAt) {
      setDone(true);
    } else {
      setDone(false);
    }
  }, [next.completedAt, setDone]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setHowLong(next.howLong);
    setAssigned(next.assigned);
    setStartDate(new Date(next.start));
    setEndDate(new Date(next.guessEnd));
    setOpen(false);
  };

  const addTech = () => {};
  const removeTech = () => {};
  const updateMyCollab = () => {};

  const begin = () => {};
  const update = () => {};
  const finish = () => {};
  return (
    <div>
      {done ? (
        <List>
          <ListItem
            secondaryAction={
              <IconButton disabled edge="end">
                <DoneAll color="success" />
              </IconButton>
            }
          >
            <Typography color="green" ml={2} mt={2} mb={1}>
              {next.text}
            </Typography>
          </ListItem>
          <Divider color="success" />
        </List>
      ) : (
        <List>
          <ListItemButton onClick={handleOpen}>
            <ListItem
              secondaryAction={
                <IconButton disabled edge="end">
                  <BorderColor color="dark" />
                </IconButton>
              }
            >
              <Typography color="grey" mb={1}>
                {next.text}
              </Typography>
            </ListItem>
          </ListItemButton>
          <Divider />
        </List>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Alert icon={false} variant="filled" severity="warning">
            Manage Next: <b>{next.text}</b>
          </Alert>
          <Grid container>
            <Grid xs={6} item>
              <Typography sx={{ marginTop: '10px' }} variant="h6">
                Who is responsible?
              </Typography>
            </Grid>

            <Grid xs={6} item>
              <ListOfTechs
                addTech={addTech}
                removeTech={removeTech}
                updateMyCollab={updateMyCollab}
                collab={assigned}
              />
            </Grid>
          </Grid>
          <Divider />
          <Grid
            container
            spacing={2}
            sx={{ marginBottom: '20px', marginTop: '10px' }}
          >
            <Grid item xs={4}>
              <b>How long will this take?</b>
              <NextPredict setHowLong={setHowLong} howLong={howLong} />
            </Grid>
            <Grid item xs={4}>
              <b>Start Date: </b>
              <Divider sx={{ marginBottom: '18px', bgcolor: 'white' }} />
              <DatePicker
                selected={startDate}
                onChange={(date) => begin(date)}
                minDate={moment().toDate()}
              />
            </Grid>
            <Grid item xs={4}>
              <b>End Date: </b>
              <Divider sx={{ marginBotto: '5px' }} />
              <p>{moment(endDate).format('MMM Do YY')}</p>
            </Grid>
          </Grid>
          <Divider sx={{ marginBottom: '20px' }} />
          <Grid sx={{ align: 'center' }} spacing={4} container>
            <Grid xs={4} item>
              <Button
                variant="outlined"
                color="warning"
                onClick={handleClose}
                fullWidth
              >
                Cancel <Cancel />
              </Button>
            </Grid>
            <Grid xs={4} item>
              <Button
                onClick={update}
                variant="outlined"
                color="info"
                fullWidth
              >
                Update <Update />
              </Button>
            </Grid>
            <Grid xs={4} item>
              <Button
                onClick={finish}
                variant="outlined"
                color="success"
                fullWidth
              >
                Complete <DoneAll />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default CompleteNext;
