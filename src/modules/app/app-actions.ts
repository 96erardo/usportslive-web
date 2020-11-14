import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { ClientCredentials, Configuration, PaginatedResponse, QueryResult } from '../../shared/types';
import Logger from 'js-logger';
import { useAppStore } from './app-store';
import { request } from '../../shared/config/axios';

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