import axios from 'axios';

export const omdbApi = axios.create({
  baseURL: 'https://www.omdbapi.com/',
  params: {
    apikey: '155a7509'
  }
});

export const backendApi = axios.create({
  baseURL: 'http://localhost:5000',
});
