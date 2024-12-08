import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Cambia por la URL de tu backend.
});

export default api;
