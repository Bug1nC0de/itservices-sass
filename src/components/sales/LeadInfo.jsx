import {
  Box,
  Alert,
  List,
  Typography,
  CircularProgress,
  Divider,
  Button,
  useTheme,
  Paper,
  FormControl,
  TextField,
  IconButton,
  Grid,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ChevronLeft, Launch, SendOutlined } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getLead,
  fetchLeadText,
  getLeadNotes,
  getFollowUps,
  getDoneFollowUps,
} from '../../api/main/salesApi';
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';
import AddLeadNote from '../common/modals/AddLeadNote';
import ScheduleFollow from '../common/modals/ScheduleFollowUp';
import FollowUpInfo from '../common/modals/FollowUpInfo';
import Text from '../common/Texts';
import LeadStage from '../common/modals/LeadStage';
import ListOfTechs from '../management/ListOfTechs';

const LeadInfo = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [collab, setCollab] = useState([]);
  const [leadStage, setLeadStage] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [text, setText] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { lead, lead_notes, leadFollowUps, texts, quote, invoice, done } =
    useSelector((state) => state.sales);

  const getLeadInfo = async () => {
    getLead(leadId);
    fetchLeadText(leadId);
    getLeadNotes(leadId);
    getFollowUps(leadId);
    getDoneFollowUps(leadId);
  };

  useEffect(() => {
    if (leadId) {
      getLeadInfo();
    }
  }, [leadId]);

  useEffect(() => {
    if (lead) {
      setCreatedBy(lead.createdBy);
      setLeadStage(lead.stage);
      setCollab(lead.collab);
    }
  }, [lead]);

  if (!lead || !texts) return <CircularProgress />;

  const changeLeadStage = async () => {};
  const navToGenQuote = () => {};
  const navToGenInvoice = () => {};
  const addTech = () => {};
  const removeTech = () => {};
  const updateMyCollab = () => {};
  const onSubmit = async (e) => {
    e.preventDefault();
    // handle send text
  };

  return (
    <>
      {/* Header */}
      <Grid container spacing={2} alignItems="center">
        <Grid size={1}>
          <Button onClick={() => navigate(-1)} sx={{ color: colors.grey[500] }}>
            <ChevronLeft />
          </Button>
        </Grid>
        <Grid size={5}>
          <Typography
            variant="h5"
            sx={{ color: colors.grey[500], fontWeight: 'bold' }}
          >
            {lead.desc} for {lead.name}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {/* Left Panel - Lead Details */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: colors.greenAccent[400], fontWeight: 'bold' }}
          >
            Lead details:
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {/* Lead Stage */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={5}>
              <Typography
                sx={{
                  color: colors.grey[500],
                  fontWeight: 'bold',
                  fontSize: 15,
                }}
              >
                Lead stage:
              </Typography>
            </Grid>
            <Grid size={5}>
              <LeadStage
                leadStage={leadStage}
                changeLeadStage={changeLeadStage}
                leadId={leadId}
              />
            </Grid>
          </Grid>

          {/* Quote */}
          <Grid container spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <Grid size={6}>
              <Typography
                sx={{
                  color: colors.grey[500],
                  fontWeight: 'bold',
                  fontSize: 15,
                }}
              >
                Lead Quote
              </Typography>
            </Grid>
            <Grid size={6}>
              <Button
                variant="outlined"
                onClick={navToGenQuote}
                sx={{ color: colors.grey[500], borderColor: colors.grey[500] }}
              >
                {quote ? 'Edit Quote' : 'Add Quote'}
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />
          {quote ? (
            <a href={quote} target="_blank" rel="noreferrer">
              View Quote <Launch sx={{ ml: 1 }} />
            </a>
          ) : (
            <Typography sx={{ color: colors.redAccent[700] }}>
              No quote added
            </Typography>
          )}

          {/* Invoice */}
          <Grid container spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <Grid size={6}>
              <Typography
                sx={{
                  color: colors.grey[500],
                  fontWeight: 'bold',
                  fontSize: 15,
                }}
              >
                Lead Invoice
              </Typography>
            </Grid>
            <Grid size={6}>
              <Button
                variant="outlined"
                color="success"
                onClick={navToGenInvoice}
              >
                {invoice ? 'Edit Invoice' : 'Add Invoice'}
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />
          {invoice ? (
            <a href={invoice} target="_blank" rel="noreferrer">
              View Invoice <Launch />
            </a>
          ) : (
            <Typography sx={{ color: colors.redAccent[700] }}>
              No invoice added
            </Typography>
          )}

          {/* Completed follow ups */}
          <Typography
            sx={{
              color: colors.blueAccent[100],
              fontWeight: 'bold',
              fontSize: 15,
              mt: 2,
            }}
          >
            Completed follow ups
          </Typography>
          <Divider sx={{ my: 1 }} />
          {done === null ? (
            <CircularProgress />
          ) : done.length === 0 ? (
            <Alert severity="warning">
              You have not completed any follow ups
            </Alert>
          ) : (
            done.map((fl) => (
              <FollowUpInfo
                key={fl.id}
                fl={fl}
                leadId={leadId}
                toLead={false}
              />
            ))
          )}
        </Grid>

        {/* Middle Panel - Notes + Follow Ups */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Notes */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={10}>
              <Typography
                variant="h6"
                sx={{ color: colors.greenAccent[400], fontWeight: 'bold' }}
              >
                Lead notes
              </Typography>
            </Grid>
            <Grid size={2}>
              <AddLeadNote leadId={leadId} user={userInfo} />
            </Grid>
          </Grid>

          {lead_notes === null ? (
            <CircularProgress />
          ) : lead_notes.length === 0 ? (
            <Alert>Lead has no notes</Alert>
          ) : (
            lead_notes.map((note) => (
              <div key={note.id}>
                <Typography sx={{ mt: 2 }}>{note.note}</Typography>
                <Divider />
              </div>
            ))
          )}

          {/* Follow ups */}
          <Grid container spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <Grid size={10}>
              <Typography
                variant="h6"
                sx={{ color: colors.greenAccent[400], fontWeight: 'bold' }}
              >
                Lead follow ups
              </Typography>
            </Grid>
            <Grid size={2}>
              <ScheduleFollow leadId={leadId} user={userInfo} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />
          {leadFollowUps == null ? (
            <CircularProgress />
          ) : leadFollowUps.length === 0 ? (
            <Alert severity="warning">Lead has no follow ups</Alert>
          ) : (
            leadFollowUps.map((fl) => (
              <FollowUpInfo
                key={fl.id}
                fl={fl}
                leadId={leadId}
                toLead={false}
              />
            ))
          )}
        </Grid>

        {/* Right Panel - Collaboration + Chat */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid size={9}>
              <Typography
                variant="h6"
                sx={{ color: colors.greenAccent[400], fontWeight: 'bold' }}
              >
                Collaboration
              </Typography>
            </Grid>
            <Grid size={1}>
              <Typography>{lead.collab.length}</Typography>
            </Grid>
            <Grid size={2}>
              {createdBy?.id === userInfo.id && (
                <ListOfTechs
                  addTech={addTech}
                  removeTech={removeTech}
                  updateMyCollab={updateMyCollab}
                  collab={collab}
                />
              )}
            </Grid>
          </Grid>

          {/* Chat */}
          <Paper
            sx={{
              mt: 2,
              height: '80vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box flex={1} p={2} overflow="auto">
              <List>
                {texts.length === 0
                  ? 'No texts'
                  : texts.map((t) => (
                      <Text key={t.id} text={t} userId={userInfo.id} />
                    ))}
              </List>
            </Box>
            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{ p: 2, display: 'flex', gap: 1 }}
            >
              <FormControl fullWidth>
                <TextField
                  label="Type your message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  size="small"
                />
              </FormControl>
              <IconButton type="submit" size="small" color="primary">
                <SendOutlined />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default LeadInfo;
