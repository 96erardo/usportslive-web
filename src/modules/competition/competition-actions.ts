import { request, authenticated } from '../../shared/config/axios';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { QueryResult, PaginatedResponse, Competition } from '../../shared/types';
import Logger from 'js-logger';
import qs from 'qs';

/**
 * Fetches the team list
 * 
 * @param {number} page - The page to fetch the items from
 * @param {Array<string>} include - The relations to include in each competition
 * @param {object} data - The data to create the filters from
 * @param {CancelTokenSource} source - The cancel token to cancel de request if needed
 * 
 * @return {Promise<QueryResult<PaginatedResponse<Competition>>>} The list of competitions
 */
export async function fetchCompetitions (
  page: number = 1,
  include: Array<string> = [],
  data: FilterData = {},
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Competition>>> {
  const first = 10;
  const skip = first * (page - 1);
  const filters = createFilter(data);
  const query = qs.stringify({ first, skip, include, filters }, { encode: false, arrayFormat: 'brackets' })
  
  try {
    const res: AxiosResponse<PaginatedResponse<Competition>> = await request.get(`/api/competitions?${query}`, {
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchCompetitions', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchCompetitions(Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchCompetitions', e);

    return [e];
  }
}

function createFilter (data: FilterData) {
  return {
    ...(data.sport ? {
      sportId: { eq: data.sport }
    } : {}),
    ...(data.q ? {
      name: { like: data.q }
    } : {})
  }
}

export type FilterData = {
  q?: string,
  sport?: number | string,
  startsAfter?: string,
  startsBefore?: string,
}