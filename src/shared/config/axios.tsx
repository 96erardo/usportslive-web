import axios from 'axios';
import qs from 'query-string';
import { useAuthStore } from '../../modules/auth/auth-store';

export const request = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
});

export const refresh = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${process.env.REACT_APP_BASIC_AUTH_B64}`
  },
  transformRequest: [function (data, headers) {
    return qs.stringify({
      ...data,
      grant_type: 'refresh_token'
    });
  }]
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

  if (response.status === 401) {
    const { refreshToken, logout, setAuthTokens } = useAuthStore.getState();

    if (!refreshToken) {
      logout();      
      return Promise.reject(error);
    }
    
    return refresh.post('/oauth/token', {refresh_token: refreshToken}) 
      .then(res => {
        const { access_token, refresh_token } = res.data;
    
        setAuthTokens(access_token, refresh_token);
    
        config.headers['Authorization'] = `Bearer ${access_token}`;
    
        return axios(config);
      }, () => logout());
  }

  throw error;
});