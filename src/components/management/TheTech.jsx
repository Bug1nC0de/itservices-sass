import { Button, Grid } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { useState, useEffect } from 'react';

const TheTech = ({ techChosen, tech, techRemove, collab }) => {
  const [pickMe, setPickMe] = useState(false);
  useEffect(() => {
    if (collab) {
      collab.forEach((team) => {
        let id = team.id;
        if (id === tech.id) {
          setPickMe(true);
        }
      });
    }
  }, [collab, tech]);
  const addToJam = (tech) => {
    setPickMe(true);
    techChosen(tech);
  };

  const removeFromJam = (techId) => {
    setPickMe(false);
    techRemove(techId);
  };

  return (
    <Grid container>
      <Grid>
        {pickMe ? (
          <Button>
            <RadioButtonCheckedIcon onClick={() => removeFromJam(tech.id)} />
          </Button>
        ) : (
          <Button onClick={() => addToJam(tech)}>
            <RadioButtonUncheckedIcon />
          </Button>
        )}
      </Grid>
      <Grid>{tech.name}</Grid>
    </Grid>
  );
};

export default TheTech;
