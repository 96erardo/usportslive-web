import axios from 'axios';
import { useAuthStore } from '../../modules/auth/auth-store';
import { useAppStore } from '../../modules/app/app-store';

export const request = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
});

request.interceptors.response.use(response => {
  return response;
}, error => {
  const { config, response } = error;
  const { setClientToken } = useAppStore.getState();

  if (response && response.status === 401) {
    return axios.post('/api/client/authenticate')
      .then(res => {
        const { accessToken } = res.data;
    
        setClientToken(accessToken);
    
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    
        return axios(config);
      });
  }

  throw error;
});

export const authenticated = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  headers: {
    'Content-Type': 'application/json',
  }
});

authenticated.interceptors.response.use(response => {
  return response;
}, error => {
  const { config, response } = error;

  if (response && response.status === 401) {
    const { refreshToken, logout, setAuthTokens } = useAuthStore.getState();

    if (!refreshToken) {
      logout();      
      return Promise.reject(error);
    }
    
    return axios.post('/api/token/refresh', {refreshToken: refreshToken}) 
      .then(res => {
        const { access_token, refresh_token } = res.data;
    
        setAuthTokens(access_token, refresh_token);
    
        config.headers['Authorization'] = `Bearer ${access_token}`;
    
        return axios(config);
      }, () => logout());
  }

  throw error;
});