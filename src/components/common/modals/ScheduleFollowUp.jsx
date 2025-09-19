import {
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  Divider,
  TextField,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingButton from '@mui/lab/LoadingButton';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import { tokens } from '../../../theme';
import { createFollowUp } from '../../../api/main/salesApi';

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

const ScheduleFollow = ({ leadId, user }) => {
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
      id: user.id,
      name: user.name,
    };
    let date = moment(followUpDate).format();
    await createFollowUp({ leadId, note, createdAt, date, createdBy });
    setCreating(false);
    handleClose();
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        sx={{ color: colors.greenAccent[400], mt: '10px' }}
        size="sm"
      >
        <AddIcon fontSize="small" />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ color: colors.blueAccent[400] }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Schedule a follow up
          </Typography>
          <Divider sx={{ marginBottom: '10px', marginTop: '10px' }} />
          <form onSubmit={followUp}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <b>When do you need to follow up?</b>
              </Grid>
              <Grid xs={6}>
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
              <LoadingButton
                loading
                fullWidth
                loadingPosition="center"
                variant="outlined"
              >
                loading...
              </LoadingButton>
            ) : (
              <Button
                sx={{
                  marginTop: '10px',
                  color: colors.blueAccent[400],
                  borderColor: colors.blueAccent[400],
                }}
                variant="outlined"
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

export default ScheduleFollow;
