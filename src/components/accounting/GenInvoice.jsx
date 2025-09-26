import {
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  useTheme,
  List,
  ListItem,
  Box,
  TextField,
  CircularProgress,
  Modal,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CancelIcon from '@mui/icons-material/Cancel';
import { tokens } from '../../theme';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ListOfClients from '../clients/ListOfClients';
import { getLeadInvoice, getLeadQuote } from '../../api/main/salesApi';
import {
  getInvoices,
  fetchServices,
  setDocClient,
  setDocuServices,
  setDocumentInfo,
} from '../../api/main/accountingApi';
import { useSelector } from 'react-redux';

import moment from 'moment';
import AddProductOrService from './AddProductOrService';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const GenInvoice = () => {
  const { leadId } = useParams();
  const [clientDetails, setClientDetails] = useState(null);
  const [clientId, setClientId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [invoiceServices, setInvoiceServices] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { invoices, info, client, services } = useSelector(
    (state) => state.accounting
  );
  const { invoice, quote } = useSelector((state) => state.sales);

  useEffect(() => {
    if (leadId) {
      getLeadInvoice(leadId);
      getLeadQuote(leadId);
    }
  }, [leadId, getLeadInvoice, getLeadQuote]);

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (invoice) {
      setClientDetails(invoice.clientDetails);
      setInvoiceServices(invoice.invoiceServices);
      setInvoiceDate(invoice.invoiceDate);
      setValidUntil(invoice.validUntil);
      setInvoiceNumber(invoice.invoiceNumber);
    } else if (info && info.type === 'invoice') {
      setClientDetails(info.clientDetails);
      setInvoiceServices(info.invoiceServices);
      setInvoiceDate(info.invoiceDate);
      setValidUntil(info.validUntil);
    } else if (client) {
      setClientDetails(client);
    }
    getInvoices();
  }, [client, getInvoices, info, invoice]);

  useEffect(() => {
    if (invoices && invoiceNumber.length === 0) {
      const monthYear = moment().format('MM/YY');
      const invoiceNumber = `#CIT-${monthYear}-${invoices.length + 1}`;
      setInvoiceNumber(invoiceNumber);
    }
  }, [invoices, invoiceNumber]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (clientDetails) {
      setClientId(clientDetails.id);
    }
  }, [clientDetails]);

  useEffect(() => {
    if (quote) {
      handleOpen();
    }
  }, [quote]);

  const goBack = () => {
    navigate(-1);
  };

  const createInvoiceFromQuote = () => {
    setClientDetails(quote.clientDetails);
    setInvoiceServices(quote.quoteServices);
    handleClose();
  };
  const addClient = (client) => {
    setClientDetails(client);
    setDocClient(client);
  };

  const removeClient = () => {
    setClientDetails(null);
    setDocClient(null);
    setClientId('');
  };

  const addServiceToAcc = (service) => {
    const existingIndex = invoiceServices.findIndex(
      (item) => item.id === service.id
    );

    if (existingIndex !== -1) {
      const updatedServices = [...invoiceServices];
      updatedServices[existingIndex].quantity += 1;
      setInvoiceServices(updatedServices);
      setDocuServices(updatedServices);
    } else {
      setInvoiceServices([...invoiceServices, { ...service, quantity: 1 }]);
      setDocuServices([...invoiceServices, { ...service, quantity: 1 }]);
    }
  };

  const formChecker = () => {
    if (!clientDetails) {
      toast.error('Please select a client');
      return false;
    }
    if (!invoiceServices || invoiceServices.length === 0) {
      toast.error('Please add at least one product or service');
      return false;
    }
    if (!invoiceDate || !validUntil) {
      toast.error('Please fill in the invoice date and valid until date');
      return false;
    }
    return true;
  };

  const createInvoice = () => {
    if (!formChecker()) return;
    //Let create the quote
    const total = invoiceServices
      .reduce((sum, item) => sum + item.quantity * item.price, 0)
      .toFixed(2);
    const type = 'invoice';
    const info = {
      clientDetails,
      invoiceServices,
      invoiceNumber,
      invoiceDate,
      validUntil,
      total,
      type,
      leadId,
    };
    const result = setDocumentInfo({
      info,
    });
    if (result) {
      navigate('/confirm-document');
    } else {
      toast.error('Something went wrong...');
    }
  };

  return (
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create invoice from quote?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => createInvoiceFromQuote()}
            >
              Yes
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
      <Grid container>
        <Grid size={{ xs: 1 }}>
          <Button onClick={goBack} sx={{ color: colors.redAccent[400] }}>
            <ArrowBackIosIcon />
          </Button>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h5" sx={{ color: colors.primary[100] }}>
            Generate Invoice
          </Typography>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Button
            sx={{
              color: colors.greenAccent[500],
              borderColor: colors.greenAccent[500],
            }}
            variant="outlined"
            onClick={() => createInvoice()}
          >
            Save and continue
          </Button>
        </Grid>
      </Grid>

      <Divider variant="middle" sx={{ mb: '10px', mt: '10px' }} />
      <Grid container>
        <Grid size={{ xs: 7 }}>
          {clientDetails ? (
            <>
              <List>
                <ListItem>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Client Name : {clientDetails.name}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Client Email : {clientDetails.email}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Client Address : {clientDetails.address}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Client Number : {clientDetails.number}
                  </Typography>
                </ListItem>
              </List>
              <Button
                sx={{ color: colors.redAccent[400] }}
                onClick={() => removeClient()}
              >
                <CancelIcon />
              </Button>
            </>
          ) : (
            <>
              <Typography>Select a client</Typography>
              <Grid sx={{ mt: '15px', width: '50%' }}>
                <ListOfClients addClient={addClient} clientId={clientId} />
              </Grid>
            </>
          )}
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Typography variant="h6">Invoice</Typography>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1 } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="quote-number"
              label="Quote Number"
              variant="outlined"
              fullWidth
              value={invoiceNumber}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              id="quote-date"
              label="Quote Date"
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              id="valid-until"
              label="Valid Until"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
            />
          </Box>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ mb: '10px', mt: '10px' }} />
      <Grid>
        {!services ? (
          <CircularProgress />
        ) : (
          <AddProductOrService
            services={services}
            addServiceToAcc={addServiceToAcc}
          />
        )}
        <Grid container sx={{ mt: 2 }}>
          <Grid size={{ xs: 6 }}>Product/Service</Grid>
          <Grid size={{ xs: 2 }}>Quantity</Grid>
          <Grid size={{ xs: 2 }}>Amount</Grid>
          <Grid size={{ xs: 2 }}>Total</Grid>
        </Grid>
        {invoiceServices.map((item, index) => (
          <Grid container key={item.id} alignItems="center" sx={{ mt: 1 }}>
            <Grid size={{ xs: 6 }}>
              <Typography>{item.name}</Typography>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const updated = invoiceServices.map((s, i) =>
                    i === index
                      ? { ...s, quantity: Math.max(Number(e.target.value), 1) }
                      : s
                  );
                  setInvoiceServices(updated);
                  setDocuServices(updated);
                }}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 2 }}>
              <TextField
                type="number"
                value={item.price}
                onChange={(e) => {
                  const updated = [...invoiceServices];
                  updated[index].price = Number(e.target.value);
                  setInvoiceServices(updated);
                  setDocuServices(updated);
                }}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 2 }} display="flex" alignItems="center">
              <Typography sx={{ mr: 1 }}>
                R {item.quantity * item.price}
              </Typography>
              <Button
                color="error"
                size="small"
                onClick={() => {
                  const updated = invoiceServices.filter((_, i) => i !== index);
                  setInvoiceServices(updated);
                  setDocuServices(updated);
                }}
              >
                <CancelIcon />
              </Button>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Divider variant="middle" sx={{ mb: '10px', mt: '10px' }} />
      <Grid container>
        <Typography>Display Invoice Total</Typography>
      </Grid>
    </Container>
  );
};

export default GenInvoice;
