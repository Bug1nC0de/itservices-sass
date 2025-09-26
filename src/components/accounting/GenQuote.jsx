import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  fetchServices,
  setDocClient,
  setDocuServices,
  getQuotes,
  setDocumentInfo,
} from '../../api/main/accountingApi';
import { tokens } from '../../theme';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CancelIcon from '@mui/icons-material/Cancel';
import ListOfClients from '../clients/ListOfClients';
import AddProductOrService from './AddProductOrService';
import { getLeadQuote, getLeadInvoice } from '../../api/main/salesApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const GenQuote = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [clientDetails, setClientDetails] = useState(null);
  const [quoteServices, setQuoteServices] = useState([]);
  const [clientId, setClientId] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const { quotes, info, client, services } = useSelector(
    (state) => state.accounting
  );
  const { quote } = useSelector((state) => state.sales);

  useEffect(() => {
    if (leadId) {
      getLeadInvoice(leadId);
      getLeadQuote(leadId);
    }
  }, [leadId, getLeadInvoice, getLeadQuote]);

  useEffect(() => {
    if (quote) {
      setClientDetails(quote.clientDetails);
      setQuoteServices(quote.quoteServices);
      setQuoteDate(quote.quoteDate);
      setValidUntil(quote.validUntil);
      setQuoteNumber(quote.quoteNumber);
    } else if (info && info.type === 'qoute') {
      setClientDetails(info.clientDetails);
      setQuoteServices(info.quoteServices);
      setQuoteDate(info.quoteDate);
      setValidUntil(info.validUntil);
    } else if (client) {
      setClientDetails(client);
    }
    getQuotes();
  }, [client, getQuotes, info, quote]);

  useEffect(() => {
    if (quotes && quoteNumber.length === 0) {
      const monthYear = moment().format('MM/YY');
      const quoteNumber = `#CIT-${monthYear}-${quotes.length + 1}`;
      setQuoteNumber(quoteNumber);
    }
  }, [quotes, quoteNumber]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (clientDetails) {
      setClientId(clientDetails.id);
    }
  }, [clientDetails]);

  const addClient = (client) => {
    setClientDetails(client);
    setDocClient(client);
  };

  const removeClient = () => {
    setClientDetails(null);
    setDocClient(null);
    setClientId('');
  };

  const goBack = () => {
    navigate(-1);
  };

  const addServiceToAcc = (service) => {
    const existingIndex = quoteServices.findIndex(
      (item) => item.id === service.id
    );

    if (existingIndex !== -1) {
      const updatedServices = [...quoteServices];
      updatedServices[existingIndex].quantity += 1;
      setQuoteServices(updatedServices);
      setDocuServices(updatedServices);
    } else {
      setQuoteServices([...quoteServices, { ...service, quantity: 1 }]);
      setDocuServices([...quoteServices, { ...service, quantity: 1 }]);
    }
  };

  const formChecker = () => {
    if (!clientDetails) {
      toast.error('Please select a client');
      return false;
    }
    if (!quoteServices || quoteServices.length === 0) {
      toast.error('Please add at least one product or service');
      return false;
    }
    if (!quoteDate || !validUntil) {
      toast.error('Please fill in the quote date and valid until date');
      return false;
    }
    return true;
  };

  const createQuote = () => {
    if (!formChecker()) return;
    //Let create the quote
    const total = quoteServices
      .reduce((sum, item) => sum + item.quantity * item.price, 0)
      .toFixed(2);
    const type = 'quote';
    const info = {
      clientDetails,
      quoteServices,
      quoteNumber,
      quoteDate,
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
      <Grid container>
        <Grid size={{ xs: 1 }}>
          <Button onClick={goBack} sx={{ color: colors.redAccent[400] }}>
            <ArrowBackIosIcon />
          </Button>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h5" sx={{ color: colors.primary[100] }}>
            Generate Quote
          </Typography>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Button
            sx={{
              color: colors.greenAccent[500],
              borderColor: colors.greenAccent[500],
            }}
            variant="outlined"
            onClick={() => createQuote()}
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
          <Typography variant="h6">Quote</Typography>
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
              value={quoteNumber}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              id="quote-date"
              label="Quote Date"
              type="date"
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
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
        {quoteServices.map((item, index) => (
          <Grid container key={item.id} alignItems="center" sx={{ mt: 1 }}>
            <Grid size={{ xs: 6 }}>
              <Typography>{item.name}</Typography>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const updated = quoteServices.map((s, i) =>
                    i === index
                      ? { ...s, quantity: Math.max(Number(e.target.value), 1) }
                      : s
                  );
                  setQuoteServices(updated);
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
                  const updated = [...quoteServices];
                  updated[index].price = Number(e.target.value);
                  setQuoteServices(updated);
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
                  const updated = quoteServices.filter((_, i) => i !== index);
                  setQuoteServices(updated);
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
      <Grid container sx={{ mt: 2 }}>
        <Grid size={{ xs: 10 }}>
          <Typography variant="h6" align="right">
            Quote Total:
          </Typography>
        </Grid>
        <Grid size={{ xs: 2 }} item>
          <Typography variant="h6">
            R
            {quoteServices
              .reduce((sum, item) => sum + item.quantity * item.price, 0)
              .toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GenQuote;
