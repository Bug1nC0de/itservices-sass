import { Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ title, count }) => {
  return (
    <Card elevation={4}>
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
