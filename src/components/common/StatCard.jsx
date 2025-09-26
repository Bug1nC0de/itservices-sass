import { Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ title, count, sx }) => {
  return (
    <Card elevation={4} sx={{ width: '100%', height: '100%', ...sx }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
