import { useState, useEffect } from 'react';
import {
  Container,
  IconButton,
  Alert,
  AlertTitle,
  ListItem,
  Modal,
  List,
  Box,
  Typography,
  Divider,
  ListItemButton,
  ListItemText,
  useTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import moment from 'moment';
import { tokens } from '../../theme';
const MilestoneInfo = ({ milestone }) => {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(null);
  const [days, setDays] = useState(null);
  const [weeks, setWeeks] = useState(null);
  const [rem, setRem] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (milestone) {
      let start = moment(milestone.start);
      let end = moment(milestone.createdAt);
      let hours = end.diff(start, 'hours');
      if (hours < 24) {
        setHours(hours);
      } else if (hours > 24 && hours < 168) {
        let days = (hours /= 24);
        setDays(days);
      } else {
        let d = (hours /= 24);
        setRem(d % 7);
        let weeks = (d /= 7);
        setWeeks(Math.round(weeks));
      }
    }
  }, [milestone]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
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
  return (
    <Container>
      <List>
        <ListItemButton onClick={handleOpen}>
          <ListItem
            secondaryAction={
              <IconButton disabled edge="end">
                <InfoIcon sx={{ color: colors.grey[500] }} />
              </IconButton>
            }
          >
            <Typography sx={{ color: colors.grey[500], fontWeight: 'bold' }}>
              {milestone.text}
            </Typography>
          </ListItem>
        </ListItemButton>

        <Divider />
      </List>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Alert icon={false} variant="filled">
            <AlertTitle>Review milestone</AlertTitle>
          </Alert>
          <List>
            <ListItem>
              <ListItemText
                primary={`Responsible Tech: ${milestone.assigned[0].name}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Start date: ${moment(milestone.start).format(
                  'MMMM Do YYYY'
                )} `}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Projected end date: ${moment(
                  milestone.guessEnd
                ).format('MMMM Do YYYY')} `}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Actual end Date: ${moment(milestone.createdAt).format(
                  'MMMM Do YYYY'
                )} `}
              />
            </ListItem>
            <ListItem>
              {hours ? (
                <ListItemText primary={`Time to completion: ${hours} hour/s`} />
              ) : days ? (
                <ListItemText primary={`Time to completion: ${days} day/s`} />
              ) : (
                <ListItemText
                  primary={`Time to completion: ${weeks} week/s: ${rem} day/s`}
                />
              )}
            </ListItem>
          </List>
        </Box>
      </Modal>
    </Container>
  );
};

export default MilestoneInfo;
