import React, { useState } from 'react';

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      console.log('Archivo para subir:', file.name);
      // Aquí puedes integrar la lógica con el backend.
      // Ejemplo:
      // const formData = new FormData();
      // formData.append('file', file);
      // api.post('/upload', formData)
      //   .then(response => console.log('Archivo subido:', response))
      //   .catch(error => console.error(error));
    } else {
      alert('Selecciona un archivo primero');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Subir Archivo</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir</button>
    </div>
  );
};

export default Upload;
