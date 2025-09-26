import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const TheClient = ({ client, clientSelected, clientId }) => {
  const [squad, setSquad] = useState(null);
  useEffect(() => {
    if (clientId === client.id) {
      setSquad(true);
    }
  }, [clientId, setSquad, client]);

  const [remove, setRemove] = useState(false);
  const [add, setAdd] = useState(false);

  const addToLoot = (client) => {
    clientSelected(client);
    setAdd(true);
    setRemove(true);
  };

  const removeFromLoot = () => {
    clientSelected(null);
    setAdd(false);
    setRemove(false);
  };

  return (
    <Grid container>
      <Grid>
        {squad ? (
          remove ? (
            <Button onClick={() => removeFromLoot()}>
              <RadioButtonUncheckedIcon />
            </Button>
          ) : (
            <Button onClick={() => addToLoot(client)}>
              <RadioButtonCheckedIcon />
            </Button>
          )
        ) : add ? (
          <Button onClick={() => removeFromLoot()}>
            <RadioButtonCheckedIcon />
          </Button>
        ) : (
          <Button onClick={() => addToLoot(client)}>
            <RadioButtonUncheckedIcon />
          </Button>
        )}
      </Grid>
      <Grid>{client.name}</Grid>
    </Grid>
  );
};

export default TheClient;
