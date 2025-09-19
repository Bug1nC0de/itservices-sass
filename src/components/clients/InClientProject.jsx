import {
  List,
  ListItemText,
  Divider,
  ListItem,
  IconButton,
  Grid,
} from '@mui/material';
import TrashProject from '../projects/TrashProject';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

const InClientProject = ({ project, clientId }) => {
  let navigate = useNavigate();
  let projectId = project.id;
  return (
    <>
      <List>
        <ListItem
          secondaryAction={
            <Grid container>
              <Grid item>
                <TrashProject clientId={clientId} projectId={projectId} />
              </Grid>
              <Grid>
                <IconButton
                  edge="end"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <ArrowForwardIos />
                </IconButton>
              </Grid>
            </Grid>
          }
        >
          <ListItemText primary={`${project.name}`} />
        </ListItem>
      </List>
      <Divider />
    </>
  );
};

export default InClientProject;
