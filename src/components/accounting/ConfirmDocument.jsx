import { useState } from 'react';
import { createNewQuote, createNewInvoice } from '../../api/main/accountingApi';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
  List,
  ListItem,
  Button,
  LinearProgress,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const ConfirmDocument = () => {
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { info } = useSelector((state) => state.accounting);

  if (info === null) {
    toast.error('No Document Info found');
    return navigate(-1);
  }

  const {
    clientDetails,
    quoteServices = [],
    invoiceServices = [],
    quoteNumber,
    invoiceNumber,
    quoteDate,
    invoiceDate,
    validUntil,
    total,
    type,
    leadId,
  } = info;

  const tl = parseFloat(total);

  const vat = tl * 0.15;
  const grandTotal = tl + vat;

  const services = type === 'invoice' ? invoiceServices : quoteServices;

  const handleSave = async () => {
    setCreating(true);
    const updatedInfo = {
      ...info,
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      vat: parseFloat(vat.toFixed(2)),
    };
    if (type === 'invoice') {
      await createNewInvoice(updatedInfo);
    } else {
      await createNewQuote(updatedInfo);
    }
    setCreating(false);
    navigate(`/tech/lead-info/${leadId}`);
  };

  return (
    <Container>
      <>
        <Button
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
          startIcon={<ArrowBackIosIcon />}
        >
          Back
        </Button>
        <Typography variant="h4" align="center" gutterBottom>
          {type === 'invoice' ? 'Invoice Preview' : 'Quote Preview'}
        </Typography>
      </>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h6">Client Details</Typography>
          <List dense>
            <ListItem>Name: {clientDetails?.name}</ListItem>
            <ListItem>Email: {clientDetails?.email}</ListItem>
            <ListItem>Address: {clientDetails?.address}</ListItem>
            <ListItem>Number: {clientDetails?.number}</ListItem>
          </List>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography variant="h6">Document Details</Typography>
          <List dense>
            <ListItem>
              {type === 'invoice' ? 'Invoice Number' : 'Quote Number'}:{' '}
              {invoiceNumber || quoteNumber}
            </ListItem>
            <ListItem>
              {type === 'invoice' ? 'Invoice Date' : 'Quote Date'}:{' '}
              {invoiceDate || quoteDate}
            </ListItem>
            <ListItem>Valid Until: {validUntil}</ListItem>
            <ListItem>Total Amount: R {total}</ListItem>
          </List>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Items</Typography>
      <Grid container sx={{ mt: 1, fontWeight: 'bold' }}>
        <Grid size={{ xs: 6 }}>
          <Typography>Product / Service</Typography>
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Typography>Quantity</Typography>
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Typography>Price</Typography>
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Typography>Total</Typography>
        </Grid>
      </Grid>

      {services.map((item, index) => (
        <Grid
          container
          key={index}
          sx={{ mt: 1, borderBottom: '1px solid #ddd', pb: 1 }}
        >
          <Grid size={{ xs: 6 }}>
            <Typography>{item.name}</Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <Typography>{item.quantity}</Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <Typography>R {item.price}</Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <Typography>R {item.quantity * item.price}</Typography>
          </Grid>
        </Grid>
      ))}

      <Divider sx={{ my: 2 }} />
      <Grid
        container
        justifyContent="flex-end"
        direction="column"
        alignItems="flex-end"
      >
        <Typography variant="body1">Subtotal: R {tl.toFixed(2)}</Typography>
        <Typography variant="body1">VAT (15%): R {vat.toFixed(2)}</Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          Total (incl. VAT): R {grandTotal.toFixed(2)}
        </Typography>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        {creating ? (
          <LinearProgress color="success" />
        ) : (
          <Button variant="contained" color="success" onClick={handleSave}>
            Confirm & Save
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ConfirmDocument;
