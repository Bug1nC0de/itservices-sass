import {
  Container,
  List,
  ListItemButton,
  ListItem,
  IconButton,
  Typography,
  Divider,
  Modal,
  Grid,
  Alert,
  Button,
  Box,
  useTheme,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import BorderColor from '@mui/icons-material/BorderColor';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../../theme';
import { followUpDone } from '../../../api/main/salesApi';
import { toast } from 'react-toastify';

const FollowUpInfo = ({ fl, leadId, toLead }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (fl.complete) {
      setDone(true);
    } else {
      setDone(false);
    }
  }, [fl, setDone]);

  // useEffect(() => {
  //   function diff_minutes(d1, d2) {
  //     var diff = (d2.getTime() - d1.getTime()) / 1000;
  //     diff /= 60;

  //     if (diff < 60) {
  //       ////
  //       console.log('We have a diff...');
  //     }
  //   }
  //   let d1 = new Date(fl.date);
  //   let d2 = new Date(fl.completedAt);

  //   diff_minutes(d1, d2);
  // }, [fl]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const completeFollow = async () => {
    setCompleting(true);
    let fid = fl.id;
    const res = await followUpDone({ leadId, fid });
    if (res === 'success') {
      toast.success('Update successful');
    } else {
      toast.error('Update failed');
    }
    setCompleting(false);
    handleClose();
  };
  return (
    <Container>
      <List>
        <ListItemButton
          sx={{ backgroundColor: done ? colors.greenAccent[600] : 'white' }}
          onClick={handleOpen}
        >
          <ListItem
            secondaryAction={
              <IconButton disabled edge="end">
                <BorderColor color="dark" />
              </IconButton>
            }
          >
            <Typography color="grey" mb={1}>
              {fl.note}
            </Typography>
          </ListItem>
        </ListItemButton>
        <Divider />
      </List>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Alert icon={false} variant="filled" severity="warning">
            Follow up info:
          </Alert>
          <Grid container>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ marginTop: '10px', color: colors.grey[500] }}>
                Scheduled follow up date;
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ marginTop: '10px', color: colors.grey[500] }}>
                {moment(fl.date).format('ll')}
              </Typography>
            </Grid>
          </Grid>

          <Grid sx={{ marginTop: '20px' }} container>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ color: colors.grey[500] }}>
                Follow up notes;
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ color: colors.grey[500] }}>
                {fl.note}
              </Typography>
            </Grid>
          </Grid>
          {done ? (
            ''
          ) : toLead ? (
            <Button
              variant="outlined"
              style={{
                color: 'orange',
                borderColor: 'orange',
                marginTop: '15px',
              }}
              fullWidth
              onClick={() => navigate(`/tech/lead-info/${leadId}`)}
            >
              Go to lead
            </Button>
          ) : completing ? (
            <LinearProgress color="success" />
          ) : (
            <Button
              variant="outlined"
              style={{
                color: 'orange',
                borderColor: 'orange',
                marginTop: '15px',
              }}
              onClick={completeFollow}
              fullWidth
            >
              Complete follow up
            </Button>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default FollowUpInfo;
