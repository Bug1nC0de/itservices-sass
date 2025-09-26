import {
  Alert,
  Box,
  Button,
  Grid,
  Modal,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
// import LoadingButton from '@mui/lab/LoadingButton';
import moment from 'moment';
import { toast } from 'react-toastify';
import { tokens } from '../../theme';

const ConfirmLeadCreation = ({
  type,
  client,
  desc,
  lead_notes,
  leadFollowUps,
  collab,
  createALead,
  userInfo,
  value,
  navToNewLead,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const checkLeadLoot = () => {
    if (desc.length < 3) {
      toast.error('Please give your lead a description');
    } else if (client === null) {
      toast.error('Please add a client to the lead');
    } else if (type === null) {
      toast.error('Please select the type of lead');
    } else {
      handleOpen();
    }
  };

  const createTheLead = async () => {
    let createdBy = {
      name: userInfo.name,
      id: userInfo.id,
      webtoken: userInfo.webtoken ?? '',
      phonetoken: userInfo.phonetoken ?? '',
    };
    const createdAt = moment().format();
    const res = await createALead({
      type,
      desc,
      client,
      lead_notes,
      leadFollowUps,
      collab,
      createdBy,
      createdAt,
    });
    handleClose();
    navToNewLead(res);
  };

  return (
    <>
      <Button
        variant="outlined"
        sx={{
          color: colors.blueAccent[100],
          borderColor: colors.blueAccent[100],
        }}
        onClick={checkLeadLoot}
      >
        Create Lead
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Alert>Confirm lead creation</Alert>
          <Grid container>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ fontWeight: 'bold', color: colors.grey[500] }}>
                Lead Type:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ color: colors.greenAccent[400] }}>
                {type}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ fontWeight: 'bold', color: colors.grey[500] }}>
                Company name:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ color: colors.greenAccent[400] }}>
                {client && client.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ fontWeight: 'bold', color: colors.grey[500] }}>
                Lead Description:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ color: colors.greenAccent[400] }}>
                {desc}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ fontWeight: 'bold', color: colors.grey[500] }}>
                Lead Value:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography
                sx={{ color: colors.greenAccent[400], fontWeight: 'bold' }}
              >
                R{value}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ fontWeight: 'bold', color: colors.grey[500] }}>
                Lead Notes:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              {lead_notes.length > 0 ? (
                lead_notes.map((note) => (
                  <Typography
                    sx={{ color: colors.greenAccent[400] }}
                    key={note._id}
                  >
                    - {note.note}
                  </Typography>
                ))
              ) : (
                <Typography sx={{ color: colors.redAccent[500] }}>
                  No notes added
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={6} item>
              <Typography sx={{ fontWeight: 'bold', color: colors.grey[500] }}>
                Lead Follow Ups:
              </Typography>
            </Grid>
            <Grid xs={6} item>
              {leadFollowUps.length > 0 ? (
                leadFollowUps.map((follow) => (
                  <Typography
                    key={follow._id}
                    sx={{ color: colors.greenAccent[400] }}
                  >
                    - {follow.note}
                  </Typography>
                ))
              ) : (
                <Typography sx={{ color: colors.redAccent[500] }}>
                  No follow ups added
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={6} item>
              <Typography sx={{ fontWeight: 'bold', color: colors.grey[500] }}>
                Collaboration:
              </Typography>
            </Grid>
            <Grid xs={6} item>
              {collab.length === 0 ? (
                <Typography sx={{ color: colors.redAccent[500] }}>
                  No collaboration
                </Typography>
              ) : (
                collab.map((tech) => (
                  <Typography
                    key={tech.id}
                    sx={{ color: colors.greenAccent[400] }}
                  >
                    {tech.name}
                  </Typography>
                ))
              )}
            </Grid>
          </Grid>
          <Button
            sx={{ mt: '15px' }}
            variant="outlined"
            onClick={() => createTheLead()}
            fullWidth
          >
            Create lead
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ConfirmLeadCreation;
