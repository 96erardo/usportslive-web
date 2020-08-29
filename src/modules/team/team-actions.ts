import { request } from '../../shared/config/axios';  
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { QueryResult, PaginatedResponse, Team } from '../../shared/types';
import Logger from 'js-logger';
import qs from 'qs';

/**
 * Fetches the team list
 * 
 * @param {number} page - The page to fetch the items from
 * @param {Array<string>} include - The relations to include in each team
 * @param {object} data - The data to create the filters from
 * @param {CancelTokenSource} source - The cancel token ton cancel de request if needed
 * 
 * @return {Promise<QueryResult<PaginatedResponse<Team>>>} The list of teams
 */
export async function fetchTeams (
  page: number = 1,
  include: Array<string> = [],
  data: FilterData = {},
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Team>>> {
  const first = 10;
  const skip = first * (page - 1);
  const filters = createFilter(data);
  const query = qs.stringify({ first, skip, include, filters }, { encode: false, arrayFormat: 'brackets' })
  
  try {
    const res: AxiosResponse<PaginatedResponse<Team>> = await request.get(`/api/teams?${query}`, {
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchTeams', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchTeams(Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchTeams', e);

    return [e];
  }
}


function createFilter (data: FilterData) {
  const filter = {
    ...(data.sport ? {
      sport: { id: { eq: data.sport } }
    } : {}),
    ...(data.q ? {
      name: { like: data.q } 
    }: {})
  }

  return filter;
}

type FilterData = {
  sport?: number,
  q?: string,
}