import { Box, IconButton, TextField } from '@mui/material';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import LiveAudioVisualizer from './LiveAudioVisualizer';
import ReactionPopover from './modals/ReactionPopover';
import FileUpload from './FileUpload';

const SendMessageComponent = ({
  onSubmit,
  text,
  toggleRecording,
  status,
  colors,
  previewAudioStream,
  audioURL,
  setText,
  onEmojiSelect,
  uploadFile,
  setAudioBlob,
  setAudioURL,
  type,
  setSending,
}) => {
  return (
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
            animation: status === 'recording' ? 'blink 1s infinite' : 'none',
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
          <FileUpload
            uploadFile={uploadFile}
            type={type}
            setText={setText}
            text={text}
            setSending={setSending}
          />
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
  );
};

export default SendMessageComponent;
