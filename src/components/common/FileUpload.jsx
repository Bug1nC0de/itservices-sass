import { useState } from 'react';
import Dropzone from 'react-dropzone';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Modal, Box, TextField, Button } from '@mui/material';

const FileUpload = ({ uploadFile, type, setText, text, setSending }) => {
  const types = ['image/png', 'image/jpeg'];
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFile({ type, file: selectedFile });
      setSending(true);
      handleClose();
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && types.includes(file.type)) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setOpen(true);
    } else {
      console.log('Invalid File');
    }
  };

  return (
    <>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <AttachFileIcon />
          </div>
        )}
      </Dropzone>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: 500,
            width: '100%',
            borderRadius: 2,
          }}
        >
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                marginBottom: '16px',
              }}
            />
          )}
          <TextField
            fullWidth
            label=""
            value={text}
            onChange={(e) => setText(e.target.value)}
            margin="normal"
          />
          <Box
            sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
          >
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={!selectedFile}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default FileUpload;
