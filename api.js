// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fakestoreapi.com', // Use the fakestore API endpoint
});

export const fetchProducts = () => {
  return api.get('/products');
};
