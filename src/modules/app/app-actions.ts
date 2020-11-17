import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { ClientCredentials, Configuration, MutationResult, PaginatedResponse, QueryResult, SearchResults } from '../../shared/types';
import Logger from 'js-logger';
import { useAppStore } from './app-store';
import { authenticated, request } from '../../shared/config/axios';
import { useAuthStore } from '../auth/auth-store';
import { APP_LOGO } from '../../shared/constants';
import qs from 'qs';

/**
 * Fetches access token with client access
 * 
 * @returns {Promise<QueryResult<ClientCredentials>>} The request results
 */
export async function fetchCredentials (): Promise<QueryResult<ClientCredentials>> {
  try {

    const res: AxiosResponse<ClientCredentials> = await axios.post('/api/client/authenticate');

    Logger.info('fetchCredentials', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.info('Request canceled', e);

      return [e, true];
    }
    
    Logger.error('fetchCredentials', e);

    return [e];
  }
}

/**
 * Fetches all configuration settings in the app
 * 
 * @param {CancelTokenSource} source - Cancel token source
 * 
 * @returns {Promise<QueryResult<PaginatedResponse<Configuration>>>} - The request result
 */
export async function fetchConfiguration (source?: CancelTokenSource): Promise<QueryResult<PaginatedResponse<Configuration>>> {
  const { accessToken } = useAppStore.getState();

  try {
    const res: AxiosResponse<PaginatedResponse<Configuration>> = await request.get('/api/configurations', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchConfiguration', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.info('Request canceled', e);

      return [e, true];
    }
    
    Logger.error('fetchConfiguration', e);

    return [e];
  }
}

/**
 * Updates the app logo
 * 
 * @param {string} url - The url of the image to use as logo
 * 
 * @returns {Promise<MutationResult<Configuration>>} The request result
 */
export async function updateAppLogo (url: string): Promise<MutationResult<Configuration>> {
  const { accessToken } = useAuthStore.getState();
  const { settings } = useAppStore.getState();
  const logo = settings[APP_LOGO];

  try {
    const res: AxiosResponse<Configuration> = await authenticated.post(`/api/configurations/${logo.id}`, {
      value: url
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updateAppLogo', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('updateAppLogo', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * App search on games, teams, players and competitions
 * 
 * @param {string} value - The search term
 * @param {CancelTokenSource} source - The cancel token source if the request needs to be canceled
 * 
 * @returns {Promise<QueryResult<SearchResults>>} The request result
 */
export async function search (value: string, source?: CancelTokenSource): Promise<QueryResult<SearchResults>> {
  const { accessToken } = useAppStore.getState();

  const query = qs.stringify({ q: value }, { encode: false, arrayFormat: 'brackets' })

  try {
    const res: AxiosResponse<SearchResults> = await request.get(`/api/search?${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('search', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.info('Request canceled', e);

      return [e, true];
    }
    
    Logger.error('fetchConfiguration', e);

    return [e];
  }
}