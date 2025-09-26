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
  IconButton,
  Grid,
  CardContent,
  CardMedia,
  ListItem,
  LinearProgress,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Launch, Cancel } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getLead,
  fetchLeadText,
  getLeadNotes,
  getFollowUps,
  getDoneFollowUps,
  reactToText,
  deleteText,
  sendLeadText,
  updateCollab,
  theCollab,
  changeLeadStage,
} from '../../api/main/salesApi';
import { setDocClient } from '../../api/main/accountingApi';
import { uploadFile, clearFileUrl } from '../../api/storageApi';
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';
import AddLeadNote from '../common/modals/AddLeadNote';
import ScheduleFollow from '../common/modals/ScheduleFollowUp';
import FollowUpInfo from '../common/modals/FollowUpInfo';
import Texts from '../common/Texts';
import LeadStage from '../common/modals/LeadStage';
import ListOfTechs from '../management/ListOfTechs';
import SendMessageComponent from '../common/SendMessageComponent';
import { useReactMediaRecorder } from 'react-media-recorder';
import moment from 'moment';
import { toast } from 'react-toastify';

const LeadInfo = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [collab, setCollab] = useState([]);
  const [leadStage, setLeadStage] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const {
    lead,
    lead_notes,
    leadFollowUps,
    texts,
    quote,
    invoice,
    done,
    collabCacheAdd,
  } = useSelector((state) => state.sales);

  const [replyTo, setReplyTo] = useState(null);
  const [replyToVoice, setReplyVoice] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [sending, setSending] = useState(false);
  const [client, setClient] = useState(null);

  const scroll = useRef();
  const { file_url } = useSelector((state) => state.storage);

  const { status, startRecording, stopRecording, previewAudioStream } =
    useReactMediaRecorder({
      audio: true,
      askPermissionOnMount: true,
      onStop: (blobUrl, blob) => {
        setAudioURL(blobUrl);
        setAudioBlob(blob);
      },
    });
  const toggleRecording = () => {
    if (status === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };

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
      setClient(lead.client);
    }
  }, [lead]);

  useEffect(() => {
    if (file_url) {
      let authorId = userInfo.id;
      let imgUrl = !audioBlob ? file_url.url : null;
      let msg = audioBlob ? file_url.url : text;
      let authorName = userInfo.name;
      let createdAt = moment().format();

      let replyText = replyTo && replyTo;
      sendLeadText({
        text: msg,
        imgUrl,
        authorId,
        authorName,
        leadId,
        createdAt,
        replyTo: replyText,
      });
      clearFileUrl();
      setAudioBlob(null);
      setAudioURL('');
      setText('');
      setSending(false);
    }
  }, [file_url]);

  if (!lead || !texts) return <CircularProgress />;

  const navToGenInvoice = () => {
    setDocClient(client);
    navigate(`/gen-invoice/${leadId}`);
  };
  const navToGenQuote = () => {
    setDocClient(client);
    navigate(`/gen-quote/${leadId}`);
  };
  const addTech = (tech) => {
    //Check to see if tech is part of orignal team//
    const loot = collabCacheAdd.filter((collab) => {
      let id = collab.id;
      let techId = tech.id;
      return id === techId;
    });
    if (loot.length === 0) {
      //If tech is not part of the original team add them to add cache//
      const updatedUserList = [...collabCacheAdd, tech];
      updateCollab(updatedUserList);
    }
  };
  const removeTech = (techId) => {
    // Filter collabCacheAdd to exclude the tech with the given techId
    const updatedCollab = collabCacheAdd.filter((tech) => tech.id !== techId);

    // Update both contexts with the filtered array
    updateCollab(updatedCollab);
  };
  const updateMyCollab = async () => {
    setLoading(true);
    let myArr = collabCacheAdd;
    const res = await theCollab({ myArr, leadId });
    if (res === 'success') {
      toast.success('Update successful');
    } else {
      toast.error('Update failed');
    }
    setLoading(false);
  };

  const scrollToText = (textId) => {
    const element = document.getElementById(textId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleScroll = (text) => {
    if (texts) {
      if (scroll.current) {
        scroll.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setReplyTo(text);
    if (text.text.length === 0) return;
    const audioChecker = text.text.split('=');
    if (audioChecker.length === 1) return;
    const check = audioChecker[1].split('&');
    const loot = check[0];
    if (loot === 'media') {
      setReplyVoice(true);
    }
  };

  const onEmojiSelect = (emoji) => {
    let txt = text + emoji;
    setText(txt);
  };

  const onSubmit = async (e) => {
    if (sending) return;
    e.preventDefault();
    if (audioBlob) {
      setSending(true);
      const audioFile = new File([audioBlob], `voiceNote_${Date.now()}.webm`, {
        type: 'audio/webm',
      });
      uploadFile({ file: audioFile, type: 'sales' });
    } else if (text.trim() !== '') {
      setSending(true);
      let authorId = userInfo.id;
      let authorName = userInfo.name;
      let createdAt = moment().format();

      let replyText = replyTo && replyTo;
      let imgUrl = null;
      try {
        await sendLeadText({
          text,
          imgUrl,
          authorId,
          authorName,
          leadId,
          createdAt,
          replyTo: replyText && replyText,
        });
        setText('');
        setReplyTo(null);
        setSending(false);
      } catch (error) {
        console.error('Error Sending message: ', error);
      }
    } else {
      return toast.error('Cannot send a blank text');
    }
  };

  return (
    <>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3, mt: -5 }}>
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
      {loading && <LinearProgress color="success" />}
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
            elevation={4}
            sx={{ display: 'flex', flexDirection: 'column', height: '78vh' }}
          >
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <List id="chat-messages" disablePadding>
                {!texts ? (
                  <CircularProgress />
                ) : texts.length === 0 ? (
                  <ListItem disableGutters sx={{ px: 2, py: 1 }}>
                    No texts
                  </ListItem>
                ) : (
                  texts.map((t) => (
                    <Texts
                      key={t.id}
                      text={t}
                      userId={userInfo.id}
                      toggleScroll={toggleScroll}
                      scrollToText={scrollToText}
                      reactToText={reactToText}
                      deleteText={deleteText}
                    />
                  ))
                )}
                <div ref={scroll} />
              </List>
            </Box>
            {replyTo && (
              <Box sx={{ position: 'relative' }}>
                <CardContent
                  sx={{
                    backgroundColor: colors.grey[700],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {replyToVoice ? (
                    <audio
                      src={replyTo.text}
                      controls
                      style={{
                        width: '95%',
                        borderRadius: 999,
                        backgroundColor: 'rgba(70, 62, 62, 0.34)',
                      }}
                    />
                  ) : (
                    <Typography sx={{ color: 'white' }}>
                      {replyTo.text.length > 0 ? replyTo.text : 'Photo'}
                    </Typography>
                  )}
                  {replyTo.imgUrl && (
                    <CardMedia
                      component="img"
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        ml: 2,
                      }}
                      image={replyTo.imgUrl}
                      alt="Reply image"
                    />
                  )}
                </CardContent>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    color: 'white',
                  }}
                  onClick={() => {
                    setReplyVoice(false);
                    setReplyTo(null);
                  }}
                >
                  <Cancel fontSize="small" />
                </IconButton>
              </Box>
            )}
            {sending && <LinearProgress color="success" />}
            <SendMessageComponent
              onSubmit={onSubmit}
              text={text}
              toggleRecording={toggleRecording}
              status={status}
              colors={colors}
              previewAudioStream={previewAudioStream}
              audioURL={audioURL}
              setText={setText}
              onEmojiSelect={onEmojiSelect}
              uploadFile={uploadFile}
              setAudioBlob={setAudioBlob}
              setAudioURL={setAudioURL}
              setSending={setSending}
              type="sales"
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default LeadInfo;
