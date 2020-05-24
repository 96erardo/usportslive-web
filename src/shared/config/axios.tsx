import axios from 'axios';
import store from './redux';
import qs from 'query-string';
import { 
  setAuthTokens,
  logout
} from '../../modules/auth/auth-actions';

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
    const { auth } = store.getState();

    if (!auth.refreshToken) {
      store.dispatch(logout());
      return Promise.reject(error);
    }
    
    return refresh.post('/oauth/token', {refresh_token: auth.refreshToken}) 
      .then(res => {
        const { access_token, refresh_token } = res.data;
    
        store.dispatch(setAuthTokens(access_token, refresh_token));
    
        config.headers['Authorization'] = `Bearer ${access_token}`;
    
        return axios(config);
      }, err => store.dispatch(logout()));
  }

  throw error;
});