import { authenticated, request } from '../../shared/config/axios';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { QueryResult, PaginatedResponse, Game, Person as Player, MutationResult, Participation } from '../../shared/types';
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
        ...(data.isBefore ? { lte: data.isBefore } : {}),
      },
    } : {}),
    ...(typeof data.isLive === 'boolean' ? {
      isLive: { eq: data.isLive }
    } : {}),
    ...(data.local ? {
      local: data.local
    } : {}),
    ...(data.visitor ? {
      visitor: data.visitor
    } : {})
  }
}

export type FilterData = {
  competition?: number | string,
  isAfter?: string,
  isBefore?: string,
  isLive?: boolean,
  local?: {
    ne?: number | null,
    eq?: number | null,
  },
  visitor?: {
    ne?: number | null,
    eq?: number | null,
  }
}

/**
 * 
 * @param {number} id - The id of the game to fetch
 * @param {Array<string>} include - The relations to include with the game
 * @param {CancelTokenSource} source - The token to cancel the request if needed
 */
export async function fetchGame (
  id: number, 
  include: Array<string> = [],
  source?: CancelTokenSource
): Promise<QueryResult<{ game: Game | null }>> {

  const query = qs.stringify({ include });

  try {
    const res: AxiosResponse<{ game: Game | null }> = await request.get(`/api/games/${id}?${query}`, {
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchGame', res.data);

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

/**
 * Creates a new game object
 * 
 * @param {CreateGameInput} data - The data needed to create the gmae
 * 
 * @returns {Promise<MutationResult<Game>>} The request result
 */
export async function createGame (data: CreateGameInput): Promise<MutationResult<Game>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Game> = await authenticated.post('/api/games', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('createGame', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('createGame', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

export type CreateGameInput = {
  date: string,
  competitionId: number | string,
  localId?: number | null,
  visitorId?: number | null,
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

type UpdateGameInput = {
  id: number,
  date?: string,
  competitionId: number,
  localId?: number | null,
  visitorId?: number | null,
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

export async function addPlayerToGame (
  playerId: number,
  gameId: number,
  teamId: number,
): Promise<MutationResult<Participation>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Participation> = await authenticated.post(
      `/api/games/${gameId}/team/${teamId}/player/${playerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    Logger.info('addPlayerToGame', res.data);
    
    return [null, res.data];

  } catch (e) {
    Logger.error('addPlayerToGame', e);

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
 * Fetches the team players in a game
 * 
 * @param {number} gameId - The game id
 * @param {number} teamId - The team id
 * 
 * @returns {Promise<QueryResult<Player>>} The players in the game
 */
export async function fetchPlayersInGame (
  gameId: number, 
  teamId: number,
  type: 'playing' | 'bench' | '' = '',
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Player>>> {

  const query = qs.stringify({ type }, { encode: false, arrayFormat: 'brackets' })

  try {
    const res: AxiosResponse<PaginatedResponse<Player>> = await request.get(`/api/games/${gameId}/team/${teamId}?${query}`, {
      cancelToken: source ? source.token : undefined
    });

    Logger.info(`fetchPlayersInGame [${type}]`, res.data);

    return [null, false, res.data];

  } catch (e) { 

    if (axios.isCancel(e)) {
      Logger.error(`fetchPlayersInGame [${type}] (Canceled)`, e);

      return [e, true];
    }

    Logger.error(`fetchPlayersInGame [${type}]`, e);

    return [e];
  }
};

/**
 * Performs substitution in a game
 * 
 * @param {SubstituteData} data - The data needed to perform the substitution
 * 
 * @returns {Promise<MutationResult<void>>} The request result
 */
export async function performSubstitution (data: SubstituteData): Promise<MutationResult<void>> {
  const { accessToken } = useAuthStore.getState();

  try {

    const { gameId, teamId, ...rest } = data;

    const res: AxiosResponse<void> = await authenticated.post(`/api/games/${gameId}/team/${teamId}/substitution`, rest, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    Logger.info('performSubstitution', res.data);

    return [null];

  } catch (e) {
    Logger.error('performSubstitution', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

export type SubstituteData = {
  gameId: number,
  teamId: number,
  in: number,
  out: number,
  minute: number,
}