// ReactionBar.jsx
import { Stack, Chip, Tooltip } from '@mui/material';

const ReactionBar = ({ reactions = {}, userId, onToggle }) => {
  const entries = Object.entries(reactions);
  if (!entries.length) return null;

  return (
    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
      {entries.map(([emoji, users]) => {
        const youReacted = users.includes(userId);
        const count = users.length;
        const title = `${emoji} — ${count} reaction${count > 1 ? 's' : ''}${
          youReacted ? ' (You)' : ''
        }`;

        return (
          <Tooltip key={emoji} title={title}>
            <Chip
              size="small"
              variant={youReacted ? 'filled' : 'outlined'}
              label={`${emoji} ${count}`}
              onClick={() => onToggle(emoji)}
              sx={{
                px: 0.75,
                borderRadius: 1.5,
                fontSize: 14,
                lineHeight: 1.2,
              }}
            />
          </Tooltip>
        );
      })}
    </Stack>
  );
};

export default ReactionBar;
