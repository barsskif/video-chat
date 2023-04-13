import axios  from 'axios';
import { enumLocalStorage } from 'types/share';
import jwt_decode from 'jwt-decode';
const url: string | undefined = import.meta.env.REACT_APP_SERVER_URL;

const relocateToAuth = () => {
  localStorage.removeItem(enumLocalStorage.ACCESS_TOKEN);
  window.location.replace('/');
};


const api = (axios as any).create({
  baseURL: `${url}/api`,
});

api.interceptors.request.use(
  (config: any) => {
      console.log('config', config.headers)
    const token = localStorage.getItem(enumLocalStorage.ACCESS_TOKEN);
    const dataSession = sessionStorage.getItem('dataToken');

    if (token && window.location.pathname !== '/' && !dataSession) {
      const decodedToken = jwt_decode(token);
      sessionStorage.setItem('dataToken', JSON.stringify(decodedToken));
    }

    if (config['disableSendToken']) return config;
    if (config['formData'])
      return { ...config, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
    if (token) return { ...config, headers: { Authorization: `Bearer ${token}` } };

    return relocateToAuth();
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: any) => {
      const xApiKey = response.headers['x-api-key'];
      console.log('Значение x-api-key:', xApiKey);

    return response;
  },
  (err: { response: { status: number } }) => {
    if (err?.response?.status === 401 && window.location.pathname !== '/') {
      localStorage.removeItem(enumLocalStorage.ACCESS_TOKEN);
      return relocateToAuth();
    }

    if (err?.response?.status === 500) {
      window.location.replace('/ErrorPage');
    }

    return Promise.reject(err);
  },
);

export default api;
