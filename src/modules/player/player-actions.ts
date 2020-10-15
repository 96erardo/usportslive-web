import { request, authenticated } from '../../shared/config/axios';
import { QueryResult, PaginatedResponse, Person as Player, MutationResult } from '../../shared/types';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import Logger from 'js-logger';
import qs from 'qs';
import { useAuthStore } from '../auth/auth-store';

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
  data: FetchPlayerFilter = {},
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
 * @param {FetchPlayerFilter} data - The data to create the filters
 * 
 * @returns {object} The filter object
 */
function createFilter (data: FetchPlayerFilter) {
  const filter = {
    ...(data.q ? {
      name: { like: data.q  }
    }: {})
  }

  return filter;
}

/**
 * Creates a player in a team
 * 
 * @param {CreatePlayerInput} data - The data to create the player
 * 
 * @returns {Promise<MutationResult<Player>>} The created player
 */
export async function createPlayer (data: CreatePlayerInput): Promise<MutationResult<Player>> {
  const { accessToken } = useAuthStore.getState();

  const player = {
    name: data.name,
    lastname: data.lastname,
    number: data.number,
    gender: data.gender,
    avatarId: data.avatar,
  };

  try {
    const res: AxiosResponse<Player> = await authenticated.post(`/api/teams/${data.teamId}/player`, player, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('createPlayer', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('createPlayer', e);

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
 * Adds a player in the specified team
 * 
 * @param {AddPlayerInput} data - Data needed to add a person into a team
 * 
 * @returns {Promise<MutationResult<Player>>} The request result
 */
export async function adddPlayerInTeam (data: AddPlayerInput): Promise<MutationResult<Player>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Player> = await authenticated.post(`/api/teams/${data.teamId}/player/${data.playerId}`, {
      number: data.number
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('addPlayerInTeam', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('addPlayerInTeam', e);

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
 * Updates the specified player on the specified team
 * 
 * @param {string} teamId - The team id
 * @param {UpdatePlayerInput} data - The data to update the specified player
 * 
 * @returns {Promise<MutationResult<Player>>} The updated player
 */
export async function updatePlayer (teamId: string | number, data: UpdatePlayerInput): Promise<MutationResult<Player>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Player> = await authenticated.patch(`/api/teams/${teamId}/player/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updatePlayer', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('updatePlayer', e);

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
 * Removes the specified player from the specified team
 * 
 * @param {string | number} teamId - The team to remove the player from
 * @param {string | number} playerId - The player to remove from the team
 * 
 * @returns {Promise<MutationResult<<boolean>>} The request result
 */
export async function removePlayerFromTeam (teamId: string | number, playerId: string | number): Promise<MutationResult<boolean>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse = await authenticated.delete(`/api/teams/${teamId}/player/${playerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('removePlayer', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('removePlayer', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

export type FetchPlayerFilter = {
  q?: string,
}

export type CreatePlayerInput = {
  teamId: number,
  name: string,
  lastname: string,
  number: number | string,
  gender: string,
  avatar: number | null,
}

export type AddPlayerInput = {
  teamId: number | string,
  playerId: number | string,
  number: number | string,
}

export type UpdatePlayerInput = {
  id: null | number | string,
  name?: string,
  lastname?: string,
  number?: number | string,
  gender?: string,
  avatarId?: number | null,
}