import {
  Box,
  Button,
  Divider,
  Grid,
  LinearProgress,
  Modal,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { tokens } from '../../../theme';
import { useNavigate } from 'react-router-dom';

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

const LeadStage = ({ leadStage, changeLeadStage, leadId }) => {
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [changeStage, setChangeStage] = useState(null);
  const [changing, setChanging] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const confirmChangeStage = () => {
    let newStage = changeStage;
    setChanging(true);
    changeLeadStage({ newStage, leadId });
  };

  const reviewAndClose = () => {
    navigate(`/tech/review-and-close/${leadId}`);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        fullWidth
        sx={{
          color: colors.greenAccent[500],
          borderColor: colors.greenAccent[500],
        }}
      >
        {leadStage}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: colors.grey[500],
            }}
            gutterBottom
          >
            Would you like to change the deal stage?
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              textAlign: 'center',

              color: colors.greenAccent[500],
            }}
            gutterBottom
          >
            Click on the new stage and confirm below...
          </Typography>
          <Divider variant="middle" sx={{ mb: '15px' }} />
          <Grid
            container
            spacing={2}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Grid item>
              <Button
                variant={leadStage === 'Recon' ? 'outlined' : 'text'}
                sx={{
                  color: colors.greenAccent[500],
                  borderColor: colors.greenAccent[500],
                }}
                onClick={() => setChangeStage('Recon')}
              >
                Recon
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={leadStage === 'Pitch' ? 'outlined' : 'text'}
                sx={{
                  color: colors.greenAccent[500],
                  borderColor: colors.greenAccent[500],
                }}
                onClick={() => setChangeStage('Pitch')}
              >
                Pitch
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={leadStage === 'Quote' ? 'outlined' : 'text'}
                sx={{
                  color: colors.greenAccent[500],
                  borderColor: colors.greenAccent[500],
                }}
                onClick={() => setChangeStage('Quote')}
              >
                Quote
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={leadStage === 'Follow up' ? 'outlined' : 'text'}
                sx={{
                  color: colors.greenAccent[500],
                  borderColor: colors.greenAccent[500],
                }}
                onClick={() => setChangeStage('Follow up')}
              >
                Follow up
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={leadStage === 'Close' ? 'outlined' : 'text'}
                sx={{
                  color: colors.greenAccent[500],
                  borderColor: colors.greenAccent[500],
                }}
                onClick={() => setChangeStage('Close')}
              >
                Close
              </Button>
            </Grid>
          </Grid>
          {changeStage === null ? (
            <Button
              sx={{ backgroundColor: colors.greenAccent[500], mt: '10px' }}
              fullWidth
              variant="contained"
            >
              Current stage: {leadStage}
            </Button>
          ) : changing ? (
            <LinearProgress />
          ) : changeStage === 'Close' ? (
            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: '10px',
                borderColor: colors.redAccent[500],
                color: colors.redAccent[500],
              }}
              onClick={reviewAndClose}
            >
              Review and close lead
            </Button>
          ) : (
            <Button
              sx={{ backgroundColor: colors.greenAccent[500], mt: '10px' }}
              fullWidth
              variant="contained"
              onClick={confirmChangeStage}
            >
              Change stage to {changeStage}
            </Button>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default LeadStage;
