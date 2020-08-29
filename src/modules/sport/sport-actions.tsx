import { request } from '../../shared/config/axios';
import { Sport, PaginatedResponse } from '../../shared/types';
import Logger from 'js-logger';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import qs from 'qs';

/**
 * Fetches the sports from the api
 * 
 * @param {number} page - The page to filter the results from
 * 
 * @returns {Promise} The request result
 */
export async function fetchSports (
  page: number = 1, 
  include: Array<string> = [], 
  data = {}, 
  source?: CancelTokenSource
) {
  const first: number = 10;
  const skip: number = first * (page - 1);
  const filters = createFilter(data);
  const query: string = qs.stringify({ first, skip, include, filters }, { encode: false, arrayFormat: 'brackets' })
  
  Logger.info('fetchSports', { data, first, skip, include, filters, query });

  try {
    const res: AxiosResponse<PaginatedResponse<Sport>> = await request.get(`/api/sports?${query}`, {
      cancelToken: source ? source.token : undefined,
    });

    Logger.info('fetchSports', res.data);

    return [null, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.info('Request canceled', e);

      return [e, null, true];
    }
    
    Logger.error('fetchSports', e);

    return [e];
  }
}

function createFilter (data: SportFilter) {
  const filters = {
    ...(data.q ? {
      name: { like: data.q }
    } : {})    
  }
  ;
  
  return filters; 
}

export type SportFilter = {
  q?: string
}