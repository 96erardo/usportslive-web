import { authenticated, request } from '../../shared/config/axios';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { QueryResult, PaginatedResponse, Game, MutationResult } from '../../shared/types';
import Logger from 'js-logger';
import qs from 'qs';
import { useAuthStore } from '../auth/auth-store';

/**
 * Fetches a games list
 * 
 * @param {number} page - The page to fetch the items from
 * @param {Array<string>} include - The relations to include in each game
 * @param {object} data - The data to create the filters from
 * @param {CancelTokenSource} source - The cancel token to cancel de request if needed
 * 
 * @return {Promise<QueryResult<PaginatedResponse<Game>>>} The list of games
 */
export async function fetchGames (
  page: number = 1,
  include: Array<string> = [],
  data: FilterData = {},
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Game>>> {
  const first = page !== 0 ? 10 : undefined;
  const skip = (page !== 0 && first) ? (first * (page - 1)) : undefined;
  const filters = createFilter(data);
  const query = qs.stringify({
    first,
    skip,
    include, 
    filters 
  }, { encode: false, arrayFormat: 'brackets' })
  
  try {
    const res: AxiosResponse<PaginatedResponse<Game>> = await request.get(`/api/games?${query}`, {
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchGames', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchGames (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchGames', e);

    return [e];
  }
}

function createFilter (data: FilterData) {
  return {
    ...(data.competition ? {
      competitionId: { eq: data.competition }
    } : {}),
    ...(data.isAfter || data.isBefore ? {
      date: { 
        ...(data.isAfter ? { gte: data.isAfter } : {}),
        ...(data.isBefore ? { let: data.isBefore } : {}),
      }
    } : {}),
  }
}

export type FilterData = {
  competition?: number | string,
  isAfter?: string,
  isBefore?: string,
}

/**
 * Updates the specified game registry
 * 
 * @param {UpdateGameInput} data - Data needed to update a game object
 * 
 * @returns {Promise<MutationResult<Game>>} - The updated game
 */
export async function updateGame (data: UpdateGameInput): Promise<MutationResult<Game>> {
  const { accessToken } = useAuthStore.getState();
  const { id, ...rest } = data;

  try {
    const res: AxiosResponse<Game> = await authenticated.patch(`/api/games/${id}`, {
      ...rest
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    Logger.info('updateGame', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('updateSport', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * Deletes the specified game
 * 
 * @param {number} id - The id of the game to delete
 * 
 * @returns {Promise<MutationResult<{ success: boolean }>>} The request result
 */
export async function deleteGame (id: number): Promise<MutationResult<{ success: boolean }>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<{ success: boolean }> = await authenticated.delete(`/api/games/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('deleteGame', res.data);

    return [null, { success: true }]

  } catch (e) {
    Logger.error('updateSport', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

type UpdateGameInput = {
  id: number,
  date?: string,
  competitionId: number,
  localId?: number | null,
  visitorId?: number | null,
}