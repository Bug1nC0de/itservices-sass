import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useState } from 'react';
import { Modal, Box, useTheme, IconButton } from '@mui/material';
import { tokens } from '../../../theme';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EmojiModal = ({ size, onEmojiSelect, from }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);

  const handleEmojiClick = () => {
    setOpen(!open);
  };

  const selectEmoji = (emoji) => {
    if (from === 'text') {
      setOpen(false);
    }
    onEmojiSelect(emoji);
  };

  return (
    <div>
      <IconButton
        onClick={handleEmojiClick}
        size={size}
        sx={{ color: colors.greenAccent[600] }}
      >
        <EmojiEmotionsIcon />
      </IconButton>
      <Modal open={open} onClose={handleEmojiClick}>
        <Box sx={style}>
          <EmojiPicker onEmojiClick={(emoji) => selectEmoji(emoji)} />
        </Box>
      </Modal>
    </div>
  );
};

export default EmojiModal;
