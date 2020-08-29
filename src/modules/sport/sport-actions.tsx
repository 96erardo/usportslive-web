import { request, authenticated } from '../../shared/config/axios';
import { useAuthStore } from '../auth/auth-store';
import { Sport, PaginatedResponse, MutationResult } from '../../shared/types';
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

/**
 * Created a filter for fetching sports
 * 
 * @param {SportFilter} data - The data to create the filter from
 * 
 * @returns {object} The filter
 */
function createFilter (data: SportFilter) {
  const filters = {
    ...(data.q ? {
      name: { like: data.q }
    } : {})    
  }
  ;
  
  return filters; 
}

/**
 * Creates a new sport
 * 
 * @param {CreateSportInput} data - Input needed to create the sport
 * 
 * @returns {Promise<MutationResult<Sport>>} The created sport
 */
export async function createSport (data: CreateSportInput): Promise<MutationResult<Sport>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Sport> = await authenticated.post(`/api/sports`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('createSport', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('createSport', e);

    return [e];
  }
}

export type CreateSportInput = {
  name: string,
  color: string
}

export type SportFilter = {
  q?: string
}