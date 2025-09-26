import {
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  Alert,
  Divider,
  useTheme,
  TextField,
  LinearProgress,
} from '@mui/material';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { tokens } from '../../theme';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const FollowUpToNote = ({ addToFollowUpArr, userInfo }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [creating, setCreating] = useState(false);
  const [note, setNote] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const date = new Date();

  const followUp = async (e) => {
    e.preventDefault();
    setCreating(true);
    let createdAt = moment().format();
    let createdBy = {
      id: userInfo.id,
      name: userInfo.name,
    };
    let date = moment(followUpDate).format();
    addToFollowUpArr({ createdAt, createdBy, date, note });
    setCreating(false);
    handleClose();
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleOpen}
        sx={{
          marginBottom: '20px',
          color: colors.redAccent[500],
          borderColor: colors.redAccent[500],
        }}
        fullWidth
      >
        Add follow up
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Alert
            icon={false}
            sx={{ bgcolor: colors.redAccent[500], color: '#fff' }}
          >
            Schedule a follow up
          </Alert>
          <Divider sx={{ marginBottom: '10px', marginTop: '10px' }} />
          <form onSubmit={followUp}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <b>When do you need to follow up?</b>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DatePicker
                  selected={date}
                  onChange={(date) => setFollowUpDate(date)}
                  minDate={moment().toDate()}
                />
                <Typography>
                  {followUpDate === null
                    ? 'Set a follow up date'
                    : `${moment(followUpDate).format('ll')}`}
                </Typography>
              </Grid>
            </Grid>
            <Divider
              sx={{
                marginBottom: '20px',
                marginTop: '10px',
                color: 'white',
              }}
            />
            <Grid container>
              <TextField
                label="Follow up notes"
                variant="outlined"
                type="text"
                name="name"
                onChange={(e) => setNote(e.target.value)}
                minRows={2}
                multiline={true}
                fullWidth
                required
              />
            </Grid>
            {creating ? (
              <LinearProgress color="success" />
            ) : (
              <Button
                sx={{ marginTop: '10px', bgcolor: colors.redAccent[500] }}
                variant="contained"
                type="submit"
                fullWidth
              >
                Schedule follow up
              </Button>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default FollowUpToNote;
