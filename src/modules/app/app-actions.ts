import axios, { AxiosResponse } from 'axios';
import { ClientCredentials, QueryResult } from '../../shared/types';
import Logger from 'js-logger';

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