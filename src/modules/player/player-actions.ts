import { request } from '../../shared/config/axios';
import { QueryResult, PaginatedResponse, Person as Player } from '../../shared/types';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import Logger from 'js-logger';
import qs from 'qs';

/**
 * Fetches the players of a team
 * 
 * @param {string} id - The id to fetch the teams from
 * @param {Array<string>} include - The relations to include with each player
 * @param {CancelTokenSource} source - Source token to cancel the request if necessary
 * 
 * @returns {Promise<QueryResult<PaginatedResponse<Player>>>} The list of players
 */
export async function fetchTeamPlayers (
  id: number, 
  page: number = 1,
  include: Array<string> = [],
  data: CreatePlayerFilter = {},
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Player>>> {
  
  const first = 10;
  const skip = first * (page - 1);
  const filters = createFilter(data);
  const query = qs.stringify({ 
    first,
    skip,
    filters,
    include 
  });

  try {
    const res: AxiosResponse<PaginatedResponse<Player>> = await request.get(
      `/api/teams/${id}/players?${query}`,
      {
        cancelToken: source ? source.token : undefined
      }
    );

    Logger.info('fetchTeamPlayers', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchTeamPlayers (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchTeamPlayers', e);

    return [e];
  }
}

/**
 * Creates filter to fetch players
 * 
 * @param {CreatePlayerFilter} data - The data to create the filters
 * 
 * @returns {object} The filter object
 */
function createFilter (data: CreatePlayerFilter) {
  const filter = {
    ...(data.q ? {
      name: { like: data.q  }
    }: {})
  }

  return filter;
}

export type CreatePlayerFilter = {
  q?: string,
}