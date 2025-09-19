import Dropzone from 'react-dropzone';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const FileUpload = ({ uploadFile, type }) => {
  const types = ['image/png', 'image/jpeg'];
  const upload = async (files) => {
    let file = files[0];
    if (file && types.includes(file.type)) {
      uploadFile({ type, file });
    } else {
      console.log('Invalid File');
    }
  };
  return (
    <>
      <Dropzone onDrop={upload}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <AttachFileIcon />
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default FileUpload;
