import { useState, useEffect } from 'react';
import {
  List,
  IconButton,
  ListItem,
  ListItemText,
  Divider,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import TrashTicket from '../helpdesk/TrashTicket';

const InClientTicket = ({ ticket, clientId }) => {
  const [triage, setTriage] = useState(null);
  const [ticketId, setTicketId] = useState(ticket.id);
  useEffect(() => {
    if (ticket) {
      if (ticket.howbad === 'Not so bad') setTriage('yellow');
      if (ticket.howbad === 'Really bad') setTriage('orange');
      if (ticket.howbad === 'Its a disaster') setTriage('red');
      setTicketId(ticket.id);
    }
  }, [setTriage, ticket]);
  let navigate = useNavigate();
  const { header } = ticket;
  const fh = header.substring(0, 33);
  return (
    <>
      <List sx={{ bgcolor: `${triage}`, width: '100%' }}>
        <ListItem
          secondaryAction={
            <Grid container>
              <Grid item>
                <TrashTicket ticketId={ticketId} clientId={clientId} />
              </Grid>
              <Grid item>
                <IconButton
                  edge="end"
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                >
                  <ForumOutlinedIcon />
                </IconButton>
              </Grid>
            </Grid>
          }
        >
          <ListItemText primary={`${fh}...`} />
        </ListItem>
      </List>
      <Divider />
    </>
  );
};

export default InClientTicket;
