import { request } from '../../shared/config/axios';
import { Sport, PaginatedResponse } from '../../shared/types';
import Logger from 'js-logger';
import { AxiosResponse } from 'axios';

/**
 * Fetches the sports from the api
 * 
 * @param {number} page - The page to filter the results from
 * 
 * @returns {Promise} The request result
 */
export async function fetchSports (page: number = 1, include: Array<string> = [], filters = {}) {
  const first = 10;
  const skip = first * (page - 1);

  try {
    const res: AxiosResponse<PaginatedResponse<Sport>> = await request.get(`/api/sports`, {
      params: {
        first,
        skip,
        include,
        filters,
      }
    });

    Logger.info('fetchSports', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('fetchSports', e);

    return [e];
  }
}