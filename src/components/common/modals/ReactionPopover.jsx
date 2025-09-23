// ReactionPopover.jsx
import { useState } from 'react';
import {
  IconButton,
  Popover,
  Box,
  Stack,
  Tooltip,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';
import { tokens } from '../../../theme';

const DEFAULT_QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '😮', '😢', '👏'];

const ReactionPopover = ({
  size,
  quickReactions = DEFAULT_QUICK_REACTIONS,
  onEmojiSelect,
  from,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setShowPicker(false);
  };

  const handleSelect = (emoji) => {
    onEmojiSelect(emoji);
    if (from === 'text') handleClose();
  };

  return (
    <>
      <Tooltip title="Add reaction">
        <IconButton
          onClick={handleOpen}
          size={size}
          sx={{ color: colors.greenAccent[600] }}
          aria-label="Add reaction"
        >
          <EmojiEmotionsIcon />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        style={{ borderRadius: 2 }}
      >
        {/* Quick reactions */}
        <Stack direction="row" spacing={0.5} sx={{ px: 0.5, pb: 0.5 }}>
          {quickReactions.map((r) => (
            <Button
              key={r}
              onClick={() => handleSelect(r)}
              sx={{
                minWidth: 36,
                height: 36,
                fontSize: 20,
                lineHeight: 1,
                px: 0,
                borderRadius: 2,
              }}
            >
              {r}
            </Button>
          ))}
          <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
          <Button
            onClick={() => setShowPicker((v) => !v)}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            {showPicker ? 'Close' : 'More'}
          </Button>
        </Stack>

        {/* Full emoji picker */}
        {showPicker && (
          <Box sx={{ maxHeight: 380, overflow: 'auto' }}>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                console.log('Selected Emoji: ', emojiData);
                handleSelect(emojiData.emoji);
              }}
              skinTonesDisabled={false}
              lazyLoadEmojis
              searchDisabled={false}
            />
          </Box>
        )}
      </Popover>
    </>
  );
};

export default ReactionPopover;
