import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Grid,
  useTheme,
  Container,
  Divider,
  Button,
  ListItem,
  ListItemText,
  IconButton,
  List,
  ListItemButton,
} from '@mui/material';
import {
  createLead,
  updateNoteToNewLead,
  updateFollowToNewNote,
  updateCollab,
  updateClientToLead,
} from '../../api/main/salesApi';
import { getTechs } from '../../api/main/techApi';
import { v4 as uuidv4 } from 'uuid';
import { tokens } from '../../theme';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ListOfClients from '../clients/ListOfClients';
import NoteToLead from './NoteToLead';
import FollowUpToNote from './FollowUpToNote';
import RemoveIcon from '@mui/icons-material/Remove';
import ListOfTechs from '../management/ListOfTechs';
import { Cancel, Email, Phone, PushPinOutlined } from '@mui/icons-material';
import ConfirmLeadCreation from './ConfirmLeadCreation';
import { useSelector } from 'react-redux';

const AddLead = () => {
  const [type, setType] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [clientId, setClientId] = useState(null);
  const [desc, setDesc] = useState('');
  const [value, setValue] = useState(0);
  const { userInfo } = useSelector((state) => state.auth);
  const { lead_notes, leadFollowUps, collabCacheAdd, client } = useSelector(
    (state) => state.sales
  );
  let navigate = useNavigate();
  useEffect(() => {
    getTechs();
  }, [getTechs]);

  useEffect(() => {
    if (client) {
      setClientId(client.id);
    } else {
      setClientId(null);
    }
  }, [client, setClientId]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    address: '',
  });

  const { name, email, number, address } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addClient = (client) => {
    updateClientToLead(client);
  };

  const addToNoteArr = ({ createdAt, createdBy, note }) => {
    const _id = uuidv4();
    const newNote = {
      _id,
      createdAt,
      createdBy,
      note,
    };
    let arr = lead_notes.concat(newNote);
    updateNoteToNewLead(arr);
  };

  const removeNote = (id) => {
    const arr = lead_notes.filter((note) => {
      return note._id !== id;
    });
    updateNoteToNewLead(arr);
  };

  const addToFollowUpArr = ({ createdAt, createdBy, date, note }) => {
    const _id = uuidv4();
    const newFollowU = {
      _id,
      createdAt,
      createdBy,
      date,
      note,
    };
    let arr = leadFollowUps.concat(newFollowU);
    updateFollowToNewNote(arr);
  };

  const removeClient = () => {
    updateClientToLead(null);
  };

  const removeFollowup = (id) => {
    const arr = leadFollowUps.filter((followUp) => {
      return followUp._id !== id;
    });
    updateFollowToNewNote(arr);
  };

  const addUser = (tech) => {
    //Check to see if tech is part of orignal team//
    const loot = collabCacheAdd.filter((collab) => {
      let id = collab.id;
      let techId = tech.id;
      return id === techId;
    });
    if (loot.length === 0) {
      //If tech is not part of the original team add them to add cache//
      const updatedUserList = [...collabCacheAdd, tech];
      updateCollab(updatedUserList);
    }
  };

  const removeTech = (techId) => {
    // Filter collabCacheAdd to exclude the tech with the given techId
    const updatedCollab = collabCacheAdd.filter((tech) => tech.id !== techId);

    // Update both contexts with the filtered array
    updateCollab(updatedCollab);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateClientToLead(formData);
  };

  const goBack = () => {
    navigate(-1);
  };

  const navToNewLead = (leadId) => {
    removeClient();
    updateCollab([]);
    updateNoteToNewLead([]);
    updateFollowToNewNote([]);
    navigate(`/lead-info/${leadId}`);
  };

  const upadateMyCollab = () => {
    //
  };

  return (
    <Container>
      <Box>
        <Grid container>
          <Grid size={{ xs: 1 }}>
            <Button onClick={goBack} sx={{ color: colors.redAccent[400] }}>
              <ArrowBackIosIcon />
            </Button>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <Typography variant="h5" sx={{ color: colors.blueAccent[100] }}>
              Add a new lead
            </Typography>
          </Grid>

          <Grid size={{ xs: 3 }}>
            <ConfirmLeadCreation
              type={type}
              client={client}
              desc={desc}
              lead_notes={lead_notes}
              leadFollowUps={leadFollowUps}
              collab={collabCacheAdd}
              createALead={createLead}
              userInfo={userInfo}
              value={value}
              navToNewLead={navToNewLead}
            />
          </Grid>
        </Grid>
        <Divider variant="middle" sx={{ mb: '10px', mt: '10px' }} />
        <Grid spacing={2} container>
          <Grid size={{ xs: 4 }}>
            <Typography sx={{ color: colors.grey[300], fontWeight: 'bold' }}>
              Lead deatils;
            </Typography>
            <Divider
              variant="middle"
              sx={{ mb: '10px', mt: '10px', color: colors.greenAccent[400] }}
            />
            <Grid sx={{ mb: '10px' }}>
              <Typography
                sx={{
                  textAlign: 'center',
                  mb: '5px',
                  color: colors.grey[500],
                  fontWeight: 'bold',
                }}
              >
                Lead type
              </Typography>
              <Grid spacing={2} container>
                <Grid size={{ xs: 4 }}>
                  <Button
                    onClick={() => setType('Client')}
                    fullWidth
                    variant={type === 'Client' ? 'contained' : 'outlined'}
                    sx={{
                      color: type !== 'Client' ? colors.grey[500] : '',
                      borderColor:
                        type === 'Client'
                          ? colors.blueAccent[100]
                          : colors.grey[600],
                      backgroundColor:
                        type === 'Client' ? colors.blueAccent[100] : '',
                    }}
                  >
                    Client
                  </Button>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Button
                    onClick={() => setType('Sale')}
                    fullWidth
                    variant={type === 'Sale' ? 'contained' : 'outlined'}
                    sx={{
                      color: type !== 'Sale' ? colors.grey[500] : '',
                      borderColor:
                        type === 'Sale'
                          ? colors.blueAccent[100]
                          : colors.grey[500],
                      backgroundColor:
                        type === 'Sale' ? colors.blueAccent[100] : '',
                    }}
                  >
                    Sale
                  </Button>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Button
                    onClick={() => setType('Project')}
                    fullWidth
                    variant={type === 'Project' ? 'contained' : 'outlined'}
                    sx={{
                      color: type !== 'Project' ? colors.grey[500] : '',
                      borderColor:
                        type === 'Project'
                          ? colors.blueAccent[100]
                          : colors.grey[500],
                      backgroundColor:
                        type === 'Project' ? colors.blueAccent[100] : '',
                    }}
                  >
                    Project
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid>
              <TextField
                label="Lead Description"
                multiline
                maxRows={4}
                name="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                autoComplete="false"
                fullWidth
                required
              />
            </Grid>
            <Grid>
              <TextField
                label="Value"
                type="number"
                name="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="false"
                fullWidth
                required
              />
            </Grid>

            <Grid sx={{ mt: '15px' }}>
              <ListOfClients addClient={addClient} clientId={clientId} />
            </Grid>
            <Typography sx={{ textAlign: 'center', mb: '5px' }}>or</Typography>

            {client ? (
              <>
                <Grid container>
                  <Grid size={{ xs: 10 }}>
                    <Typography
                      sx={{
                        mt: '8px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: colors.grey[500],
                      }}
                    >
                      You have added; {client.name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <Button onClick={() => removeClient()}>
                      <Cancel sx={{ color: colors.redAccent[400] }} />
                    </Button>
                  </Grid>
                </Grid>
                <Divider variant="middle" sx={{ mt: '5px' }} />
                <List>
                  <ListItem>
                    <ListItemButton>
                      <Email />
                    </ListItemButton>
                    <ListItemText primary={client.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <Phone />
                    </ListItemButton>
                    <ListItemText primary={client.number} />
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <PushPinOutlined />
                    </ListItemButton>
                    <ListItemText primary={client.address} />
                  </ListItem>
                </List>
              </>
            ) : (
              <form onSubmit={onSubmit}>
                <Grid>
                  <TextField
                    label="Company Name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    autoComplete="false"
                    fullWidth
                    required
                  />
                </Grid>

                <Grid>
                  <TextField
                    label="Company Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    autoComplete="false"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid>
                  <TextField
                    label="Company Number"
                    type="number"
                    name="number"
                    value={number}
                    onChange={onChange}
                    autoComplete="false"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid>
                  <TextField
                    label="Company Address"
                    type="text"
                    name="address"
                    value={address}
                    onChange={onChange}
                    autoComplete="false"
                    fullWidth
                    required
                  />
                </Grid>

                <Button
                  sx={{ backgroundColor: 'green', mt: '15px' }}
                  fullWidth
                  variant="contained"
                  type="submit"
                >
                  Confirm client details
                </Button>
              </form>
            )}
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Typography sx={{ color: colors.grey[300], fontWeight: 'bold' }}>
              Notes and Follow ups
            </Typography>
            <Divider sx={{ mb: '10px', mt: '10px' }} variant="middle" />
            <Grid spacing={2} container>
              <Grid size={{ xs: 6 }}>
                <NoteToLead userInfo={userInfo} addToNoteArr={addToNoteArr} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FollowUpToNote
                  userInfo={userInfo}
                  addToFollowUpArr={addToFollowUpArr}
                />
              </Grid>
            </Grid>

            <Typography
              sx={{
                textAlign: 'center',
                color: colors.greenAccent[500],
                borderColor: colors.greenAccent[500],
              }}
            >
              Lead notes
            </Typography>
            <Divider variant="middle" />
            {lead_notes.length === 0 ? (
              <Typography
                sx={{ textAlign: 'center', mt: '5px', color: colors.grey[400] }}
              >
                Add a lead note
              </Typography>
            ) : (
              lead_notes.map((note) => (
                <ListItem
                  key={note._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="warning"
                      onClick={() => removeNote(note._id)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={`${note.note}`} />
                </ListItem>
              ))
            )}

            <Typography
              sx={{
                textAlign: 'center',
                mt: '10px',
                color: colors.greenAccent[500],
                borderColor: colors.greenAccent[500],
              }}
            >
              Lead follow ups
            </Typography>
            <Divider variant="middle" />
            {leadFollowUps.length === 0 ? (
              <Typography
                sx={{ textAlign: 'center', mt: '5px', color: colors.grey[400] }}
              >
                Add a lead follow up
              </Typography>
            ) : (
              leadFollowUps.map((followUp) => (
                <ListItem
                  key={followUp._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="warning"
                      onClick={() => removeFollowup(followUp._id)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={`${followUp.note}`} />
                </ListItem>
              ))
            )}
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Grid container>
              <Grid size={{ xs: 10 }}>
                <Typography
                  sx={{ color: colors.grey[300], fontWeight: 'bold' }}
                >
                  Collaborate
                </Typography>
              </Grid>
              <Grid size={{ xs: 2 }}>
                <ListOfTechs
                  addTech={addUser}
                  removeTech={removeTech}
                  upadateMyCollab={upadateMyCollab}
                  collab={collabCacheAdd}
                />
              </Grid>
            </Grid>

            {collabCacheAdd.length === 0 ? (
              <Typography
                sx={{
                  color: colors.grey[500],
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Would you like to collaborate?
              </Typography>
            ) : (
              collabCacheAdd.map((collab) => (
                <Container key={collab.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="warning"
                        onClick={() => removeTech(collab.id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={`${collab.name}`} />
                  </ListItem>
                </Container>
              ))
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AddLead;
