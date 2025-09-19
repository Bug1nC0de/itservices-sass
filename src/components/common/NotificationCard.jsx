import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StatCard from '../common/StatCard';

const NotificationCard = ({ notifications }) => {
  const navigate = useNavigate();

  const navToNote = ({ type, id }) => {
    if (type === 'ticket') {
      navigate(`/tech/tech-ticket/${id}`);
    } else if (type === 'lead') {
      navigate(`/tech/lead-info/${id}`);
    } else if (type === 'todo') {
      navigate(`/tech/tech-todo/${id}`);
    } else if (type === 'project') {
      navigate(`/tech/project/${id}`);
    }
  };
  return (
    <Grid size={{ xs: 12 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <StatCard
              title="📬 Latest Notifications"
              count={notifications && notifications.length}
            />
          </Typography>
          <Divider />
          {notifications && notifications.length > 0 ? (
            notifications.map((note, idx) => (
              <Box
                key={idx}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
                sx={{ borderBottom: '1px solid #eee', pb: 1 }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {note.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {note.body}
                  </Typography>
                </Box>
                <Box>
                  <button
                    onClick={() => {
                      const type = note.type;
                      const id = note.referenceId;
                      navToNote({ type, id });
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography mt={2} color="text.secondary">
              No new notifications yet.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default NotificationCard;
