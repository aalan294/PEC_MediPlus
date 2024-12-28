import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.32.227:3500'
});

export default api;