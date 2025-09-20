import {
  CircularProgress,
  Paper,
  Typography,
  Box,
  Divider,
  Grid,
  List,
  TextField,
  IconButton,
  ListItem,
  Button,
  Alert,
  useTheme,
  CardContent,
  CardMedia,
} from '@mui/material';
import { toast } from 'react-toastify';
import Text from '../common/Texts';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams } from 'react-router-dom';
import {
  fetchTicket,
  fetchTicketTexts,
  sendText,
} from '../../api/main/helpdeskApi';
import {
  fetchYourTicketTexts,
  sendTicketText,
} from '../../api/users/helpdeskApi';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { uploadFile, clearFileUrl } from '../../api/storageApi';
import { useReactMediaRecorder } from 'react-media-recorder';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftOutlined } from '@mui/icons-material';
import ClaimTicket from '../common/modals/ClaimTicket';
import CloseTicket from '../common/modals/CloseTicket';
import FileUpload from '../common/FileUpload';
import LiveAudioVisualizer from '../common/LiveAudioVisualizer';
import ReactionPopover from '../common/modals/ReactionPopover';

const Ticket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userInfo } = useSelector((state) => state.auth);
  const profileType = userInfo.profileType;
  const { name } = userInfo;
  const { ticket, texts } = useSelector((state) => state.helpdesk);
  const { file_url, progress } = useSelector((state) => state.storage);
  let closeBtn = useRef();
  const [ticketType, setTicketType] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');

  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const scroll = useRef();
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [replyToVoice, setReplyVoice] = useState(false);
  const [sending, setSending] = useState(false);
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
  useEffect(() => {
    if (ticket && ticket.userClientId) {
      setTicketType('Client');
      if (userInfo.profileType === 'user') {
        setTicketTitle('Address the ticket');
      } else {
        setTicketTitle('Get Help');
      }
    } else {
      setTicketType('Main');
      if (userInfo.profileType === 'itservices') {
        setTicketTitle('Address the ticket');
      } else {
        setTicketTitle('Get Help');
      }
    }
  }, [ticket, userInfo]);
  useEffect(() => {
    if (texts) {
      if (scroll.current) {
        scroll.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [texts]);
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
  const scrollToText = (textId) => {
    const element = document.getElementById(textId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const getTicketData = async () => {
    await fetchTicket(id);
  };
  const getTicketTexts = (ticket) => {
    if (ticket.userClientId) {
      const unsub = fetchYourTicketTexts(ticket.id);
      return unsub;
    } else {
      const unsub = fetchTicketTexts(ticket.id);
      return unsub;
    }
  };
  useEffect(() => {
    if (id) {
      getTicketData();
    }
  }, [id]);
  useEffect(() => {
    if (ticket) {
      getTicketTexts(ticket);
    }
  }, [ticket]);
  useEffect(() => {
    if (file_url) {
      let authorId = userInfo.id;
      let text = file_url.url;
      let authorName = name;
      let createdAt = moment().format();
      let ticketId = id;
      let userId = userInfo.id;
      let replyText = replyTo && replyTo;
      if (ticketType === 'Main') {
        sendText({
          id,
          text,
          authorId,
          createdAt,
          authorName,
          userId,
          ticketId,
          replyTo: replyText && replyText,
        });
      } else {
        sendTicketText({
          id,
          text,
          authorId,
          createdAt,
          authorName,
          userId,
          ticketId,
          replyTo: replyText && replyText,
        });
      }
      clearFileUrl();
      setAudioBlob(null);
      setAudioURL('');
      setSending(false);
    }
  }, [file_url, id, sendText, userInfo, name, ticketType]);

  const onEmojiSelect = (emoji) => {
    let txt = text + emoji;
    setText(txt);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (audioBlob) {
      setSending(true);
      const audioFile = new File([audioBlob], `voiceNote_${Date.now()}.webm`, {
        type: 'audio/webm',
      });
      uploadFile({ file: audioFile, type: 'texts' });
    } else if (text.trim() !== '') {
      setSending(true);
      let authorId = userInfo.id;
      let authorName = name;
      let createdAt = moment().format();
      let userId = userInfo.id;
      let ticketId = id;
      let replyText = replyTo && replyTo;
      if (ticketType === 'Main') {
        sendText({
          id,
          text,
          authorId,
          createdAt,
          authorName,
          userId,
          ticketId,
          replyTo: replyText && replyText,
        });
        setText('');
        setReplyTo(null);
      } else {
        sendTicketText({
          id,
          text,
          authorId,
          createdAt,
          authorName,
          userId,
          ticketId,
          replyTo: replyText && replyText,
        });
        setText('');
        setReplyTo(null);
      }

      setSending(false);
    } else {
      return toast.error('Cannot send a blank text');
    }
  };
  if (!ticket || !texts) {
    return <CircularProgress />;
  }
  const {
    header,
    createdBy,
    assignedTo,
    createdAt,
    email,
    isComplete,
    ticketNum,
    username,
    completedAt,
    desc,
    review,
    userId,
    userClientId,
  } = ticket;

  return (
    <>
      <Grid container sx={{ mt: -2.25, mb: 1.25 }}>
        <Grid>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeftOutlined
              sx={{ color: colors.grey[500], fontSize: 25, mt: -0.6 }}
            />
          </Button>
        </Grid>
        <Grid>
          <Typography variant="h6">{ticketTitle}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 9 }}>
              <List disablePadding>
                <ListItem disableGutters sx={{ pb: 1 }}>
                  <Typography variant="subtitle1">Header: {header}</Typography>
                </ListItem>
                <Divider />
                <ListItem disableGutters sx={{ py: 1 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="subtitle1">
                        User: {username}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      {isComplete ? (
                        <Button variant="outlined" color="success" size="small">
                          Closed {moment(completedAt).calendar()}
                        </Button>
                      ) : (
                        <Button variant="outlined" color="warning" size="small">
                          Opened {moment(createdAt).calendar()}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem disableGutters sx={{ py: 1 }}>
                  <Typography variant="subtitle1">
                    Description: {desc}
                  </Typography>
                </ListItem>
                {review === null && isComplete && (
                  <>
                    <Divider />
                    <ListItem disableGutters sx={{ py: 1 }}>
                      <Typography variant="subtitle1">
                        Ticket needs review
                      </Typography>
                    </ListItem>
                  </>
                )}
              </List>
              <Divider />
            </Grid>
            {ticketType === 'Main' &&
              profileType === 'itservices' &&
              !isComplete && (
                <Grid size={{ xs: 12, md: 3 }}>
                  <List disablePadding>
                    <ListItem disableGutters sx={{ py: 1 }}>
                      <ClaimTicket
                        techId={userInfo.id}
                        techName={userInfo.name}
                        ticketId={id}
                        assignedTo={assignedTo}
                        email={email}
                        createdBy={createdBy}
                        username={username}
                        userId={userId}
                        userClientId={userClientId}
                      />
                    </ListItem>
                    <ListItem disableGutters sx={{ py: 1 }}>
                      <CloseTicket
                        ticketId={id}
                        closeBtn={closeBtn}
                        email={email}
                        ticketNum={ticketNum}
                        username={username}
                        userId={userId}
                        userClientId={userClientId}
                      />
                    </ListItem>
                  </List>
                </Grid>
              )}
          </Grid>
        </Grid>
        {/* Right side */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={4}
            sx={{ display: 'flex', flexDirection: 'column', height: '78vh' }}
          >
            {/* Scrollable message list */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <List id="chat-messages" disablePadding>
                {texts.length === 0 ? (
                  <ListItem disableGutters sx={{ px: 2, py: 1 }}>
                    No texts
                  </ListItem>
                ) : (
                  texts.map((t) => (
                    <Text
                      key={t.id}
                      text={t}
                      userId={userInfo.id}
                      toggleScroll={toggleScroll}
                      scrollToText={scrollToText}
                    />
                  ))
                )}
                <div ref={scroll} />
              </List>
            </Box>
            {/* Reply to text behaviour */}
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
                      sx={{ width: 50, height: 50, objectFit: 'cover', ml: 2 }}
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
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            {/* Composer */}
            {ticket.isComplete ? (
              <Alert sx={{ m: 2 }}>Ticket marked as complete!</Alert>
            ) : (
              <Box
                component="form"
                onSubmit={onSubmit}
                sx={{
                  p: 2,
                  pt: 1,
                  borderTop: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {/* Chat-like input */}
                {text.length === 0 && (
                  <IconButton
                    onClick={toggleRecording}
                    sx={{
                      color:
                        status === 'recording'
                          ? colors.blueAccent[400]
                          : colors.grey[500],
                      '@keyframes blink': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.3 },
                        '100%': { opacity: 1 },
                      },
                      animation:
                        status === 'recording' ? 'blink 1s infinite' : 'none',
                    }}
                  >
                    <RecordVoiceOverIcon />
                  </IconButton>
                )}
                {status === 'recording' ? (
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <LiveAudioVisualizer stream={previewAudioStream} />
                  </Box>
                ) : audioURL ? (
                  <audio
                    src={audioURL}
                    controls
                    style={{
                      width: '100%',
                      borderRadius: 999,
                      backgroundColor: 'rgba(70, 62, 62, 0.34)',
                    }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    placeholder="Type your message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    variant="outlined"
                    size="medium"
                    multiline
                    maxRows={4}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 999,
                        px: 1,
                      },
                    }}
                  />
                )}
                {/* Actions on the right */}
                <ReactionPopover size="medium" onEmojiSelect={onEmojiSelect} />
                {!audioURL ? (
                  <IconButton
                    size="medium"
                    aria-label="Attach file"
                    sx={{ borderRadius: 2 }}
                  >
                    <FileUpload uploadFile={uploadFile} type="texts" />
                  </IconButton>
                ) : (
                  <>
                    <IconButton
                      onClick={() => {
                        setAudioBlob(null);
                        setAudioURL('');
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                    {sending ? (
                      <CircularProgress color="warning" value={progress} />
                    ) : (
                      <IconButton
                        size="medium"
                        color="primary"
                        aria-label="Send message"
                        type="submit"
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        <SendOutlinedIcon />
                      </IconButton>
                    )}
                  </>
                )}
                {text.length > 0 && (
                  <IconButton
                    size="medium"
                    color="primary"
                    aria-label="Send message"
                    type="submit"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <SendOutlinedIcon />
                  </IconButton>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
export default Ticket;
