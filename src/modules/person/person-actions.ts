import { request } from '../../shared/config/axios';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { PaginatedResponse, Person, QueryResult } from '../../shared/types';
import { useAppStore } from '../app/app-store';
import Logger from 'js-logger';
import qs from 'qs';

/**
 * Fetches the list of persons on the app
 * 
 * @param {number} page - The page to fetch the persons from
 * @param {Array<string>} include - The relations to include with each person
 * @param {PersonFilterData} data - The data user to create filters for the query
 * @param {CancelTokenSource} source - token to cancel the request if needed
 */
export async function fetchPersons (
  page: number = 1, 
  include: Array<string> = [], 
  data: PersonFilterData = {}, 
  source?: CancelTokenSource
) {
  const first: number = 20;
  const skip: number = first * (page - 1);
  const filters = createFilter(data);
  const { accessToken } = useAppStore.getState();
  const query: string = qs.stringify({ first, skip, include, filters }, { encode: false, arrayFormat: 'brackets' })
  
  try {
    const res: AxiosResponse<PaginatedResponse<Person>> = await request.get(`/api/persons?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined,
    });

    Logger.info('fetchSports', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.info('Request canceled', e);

      return [e, true];
    }
    
    Logger.error('fetchSports', e);

    return [e];
  }
}

function createFilter (data: PersonFilterData) {
  return {
    ...(data.q ? {
      name: { like: data.q }
    } : {})
  };
}

export type PersonFilterData = {
  q?: string
};

/**
 * Fetches the specified person
 * 
 * @param {number} id - The id of the person to fetch
 * @param {Array<string>} include - The relations to include with the person
 * @param {CancelTokenSource} source - The token to cancel the request if needed
 * 
 * @returns {Promise<QueryResult<{ person: Person | null }>>} The request result
 */
export async function fetchPerson (
  id: number,
  include: Array<string> = [],
  source?: CancelTokenSource
): Promise<QueryResult<{ person: Person | null }>> {

  const { accessToken } = useAppStore.getState();
  const query: string = qs.stringify({ include }, { encode: false, arrayFormat: 'brackets' });

  try {
    const res: AxiosResponse<{ person: Person | null }> = await request.get(`/api/persons/${id}?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchPerson', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.info('Request canceled', e);

      return [e, true];
    }
    
    Logger.error('fetchSports', e);

    return [e];
  }
}