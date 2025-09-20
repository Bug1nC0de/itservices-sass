import { useEffect, useState, useRef } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Box,
  Divider,
  Grid,
  Button,
  IconButton,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { tokens } from '../../theme';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ReplyIcon from '@mui/icons-material/Reply';
import ReactAudioPlayer from 'react-audio-player';
import { deleteText, reactToText } from '../../api/main/helpdeskApi';
import { deleteFile } from '../../api/storageApi';
import { toast } from 'react-toastify';
import moment from 'moment';
import ReactionPopover from './modals/ReactionPopover';
import ReactionBar from './ReactionBar';

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

const Text = ({ text, userId, toggleScroll, scrollToText }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [author, setAuthor] = useState();
  const [voice, setVoice] = useState(null);
  const [replyToVoice, setReplyToVoice] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [reactions, setReactions] = useState();
  const handleOpen = (text) => {
    setSelectedText(text);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  let deleteBtn = useRef();
  useEffect(() => {
    if (text) {
      setReactions(text.reactions);
      if (text.authorId === userId) {
        setAuthor('You');
      } else {
        setAuthor(text.authorName);
      }
      if (text.replyTo && text.replyTo.text.length > 0) {
        const audioChecker = text.replyTo.text.split('=');
        if (audioChecker.length === 1) return;
        const check = audioChecker[1].split('&');
        const loot = check[0];
        if (loot == 'media') {
          setReplyToVoice(true);
        } else {
          setReplyToVoice(false);
        }
      }
      if (text.text.length === 0) return;
      const audioChecker = text.text.split('=');
      if (audioChecker.length > 1) {
        const check = audioChecker[1].split('&');
        const loot = check[0];
        if (loot === 'media') {
          return setVoice(text.text);
        }
      }
    }
  }, [text, userId]);

  const time = moment(text.createdAt).calendar();

  const handleReply = () => {
    toggleScroll(text);
  };

  const onEmojiSelect = async (emoji) => {
    //react to text//
    const textId = text.id;
    const res = await reactToText({ emoji, userId, textId });
    setReactions(res);
  };

  const deleteTheText = async () => {
    setDeleting(true);
    try {
      if (selectedText.imgUrl) {
        let url = selectedText.imgUrl;
        await deleteFile({ url });
      } else if (voice) {
        let url = voice;
        await deleteFile({ url });
      }
      await deleteText(text.id);
      toast.success('Delete Successfull');
      handleClose();
    } catch (error) {
      toast.success(error);
      handleClose();
    }
  };

  const handleScrollToText = () => {
    scrollToText(text.replyTo.id);
  };

  const toggleReaction = () => {};

  return (
    <>
      <Card id={text.authorId === userId ? 'my-text' : 'sender'}>
        <Box sx={{ position: 'relative' }} id={text.id}>
          {text.replyTo && (
            <CardContent
              id="my-text-text"
              sx={{
                margin: 1,
                backgroundColor: 'rgba(187, 179, 183, 0.75)',
                textAlign: 'left',
                borderRadius: 3,
                borderLeft: `5px solid ${colors.greenAccent[500]}`,
              }}
              onClick={handleScrollToText}
            >
              {replyToVoice ? (
                <ReactAudioPlayer
                  src={text.replyTo.text}
                  controls
                  style={{ width: '100%', borderRadius: 999 }}
                />
              ) : (
                <>
                  {text.replyTo.imgUrl && (
                    <CardMedia
                      component="img"
                      image={text.replyTo.imgUrl}
                      alt="Image failed to load"
                    />
                  )}
                  {text.text.length > 0 && (
                    <Typography>{text.replyTo.text}</Typography>
                  )}
                </>
              )}
            </CardContent>
          )}
          <CardContent id="my-text-text">
            {voice ? (
              <ReactAudioPlayer
                src={voice}
                controls
                style={{ width: '100%', borderRadius: 999 }}
              />
            ) : (
              <>
                {text.imgUrl && (
                  <CardMedia
                    component="img"
                    image={text.imgUrl}
                    alt="Image failed to load"
                  />
                )}
                {text.text.length > 0 && <Typography>{text.text}</Typography>}
              </>
            )}
          </CardContent>
          {text.authorId === userId ? (
            <IconButton
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                color: colors.redAccent[500],
              }}
              onClick={() => handleOpen(text)}
              size="small"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          ) : (
            <Box
              sx={{
                position: 'absolute',
                bottom: -20,
                right: 0,
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <IconButton onClick={handleReply} size="small" color="primary">
                <ReplyIcon fontSize="small" />
              </IconButton>
              <ReactionPopover
                size="small"
                onEmojiSelect={onEmojiSelect}
                from="text"
              />
            </Box>
          )}
        </Box>
        <Box sx={{ px: 1 }}>
          <ReactionBar
            reactions={reactions}
            userId={userId}
            onToggle={(emoji) => toggleReaction(emoji)}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{ flexDirection: 'column', marginLeft: 1, paddingRight: '5%' }}
        >
          {author}: {time}
        </Typography>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Are you sure you would like to delete the text?
          </Typography>
          <Divider />
          <Grid container sx={{ mt: 4 }}>
            <Grid size={{ xs: 6 }}>
              <Button variant="outlined" onClick={handleClose}>
                No
              </Button>
            </Grid>
            <Grid size={{ xs: 6 }}>
              {deleting ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  ref={deleteBtn}
                  onClick={deleteTheText}
                >
                  Yes
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default Text;
