import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import SelectSorP from './SelectSorP';
import AddIcon from '@mui/icons-material/Add';

const AddProductOrService = ({ services, addServiceToAcc }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  const addProduct = async () => {
    console.log('Add Product...', {
      name,
      price,
      type,
    });
  };

  const addServiceToQuote = (service) => {
    addServiceToAcc(service);
  };

  const serviceType = (type) => {
    setType(type);
  };
  return (
    <Container>
      <Button
        variant="outlined"
        severity="primary"
        onClick={handleOpen}
        size="small"
      >
        Add Product/Service
      </Button>
      <Dialog fullWidth={true} open={open} onClose={handleClose} scroll="paper">
        <DialogTitle id="scroll-dialog-title">
          <Grid container>
            <Grid size={{ xs: 10 }}>Add Product/Service</Grid>
            <Grid size={{ xs: 2 }}>
              <Button onClick={addProduct}>
                <AddIcon />
              </Button>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers={true}>
          <Grid container>
            <Grid size={{ xs: 3 }}>
              <SelectSorP serviceType={serviceType} />
            </Grid>
            <Grid size={{ xs: 7 }}>
              <Typography>Name:</Typography>
              <TextField
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Typography>Price:</Typography>
              <TextField
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          <hr />
          <Grid container>
            <Typography>Existing Product/Services</Typography>
            {services && services.length > 0 ? (
              services.map((service) => (
                <Grid size={{ xs: 12 }} key={service.id}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      textTransform: 'none',
                      borderColor: 'primary.main',
                    }}
                    onClick={() => addServiceToQuote(service)}
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {service.name} ({service.type})
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      R {service.price}
                    </Typography>
                  </Button>
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Typography color="text.secondary">
                  No products or services found.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AddProductOrService;
