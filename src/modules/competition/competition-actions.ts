import { request, authenticated } from '../../shared/config/axios';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { QueryResult, PaginatedResponse, Competition, Team, MutationResult } from '../../shared/types';
import { useAuthStore } from '../auth/auth-store';
import Logger from 'js-logger';
import qs from 'qs';
import moment from 'moment';

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

export async function fetchCompetition (
  id: number, 
  include: Array<string> = [], 
  source?: CancelTokenSource
): Promise<QueryResult<{ competition: Competition | null }>> {  
  const query = qs.stringify({ include });

  try {
    const res: AxiosResponse<{ competition: Competition | null }> = await request.get(`/api/competitions/${id}?${query}`, {
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchCompetition', res.data);

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


/**
 * Creates a new competition with its games
 * 
 * @param {CreateCompetitionInput} data - The data needed to create the competition
 * 
 * @returns {Promise<MutationResult<Competition>>} The created competition
 */
export async function createCompetition (data: CreateCompetitionInput): Promise<MutationResult<{ competition: Competition, success: boolean }>> {
  const { accessToken } = useAuthStore.getState();
  const { games, ...rest } = data;
  let competition: Competition;

  try {
    const res: AxiosResponse<Competition> = await authenticated.post('/api/competitions', rest, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('createCompetition', res.data);

    competition = res.data;

  } catch (e) {
    Logger.error('createCompetition', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }

  if (games.length > 0) {
    try {
      await authenticated.post(`/api/competitions/${competition.id}/games`, {
        dates: games,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

    } catch (e) {
      Logger.error('createCompetition', e);

      return [null, { competition, success: false }];
    }
  }

  return [null, { competition, success: true }];
}

export type CreateCompetitionInput = {
  name: string,
  startDate: string,
  matchTime: number,
  quantityOfTeams: number,
  quantityOfPlayers: number,
  sportId: number,
  games: Array<string>
}

/**
 * Updates the specified competition
 * 
 * @param {UpdateCompetitionInput} data - The data needed to update the competition
 * 
 * @returns {Promise<MutationResult<Competition>>} The updated competition
 */
export async function updateCompetition (data: UpdateCompetitionInput): Promise<MutationResult<{ competition: Competition, success: boolean }>> {
  const { accessToken } = useAuthStore.getState();
  const { id, ...competition } = data;

  try {
    const res: AxiosResponse<Competition> = await authenticated.patch(`/api/competitions/${id}`, {
      ...competition,
      startDate: moment(competition.startDate).toISOString()
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updateCompetition', res.data);

    return [null, { competition: res.data, success: true }];

  } catch (e) {
    Logger.error('updateCompetition', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

export type UpdateCompetitionInput = {
  id: number,
  name: string,
  startDate: string,
  matchTime: number,
  quantityOfTeams: number,
  quantityOfPlayers: number,
}

/**
 * Deletes the specified competition
 * 
 * @param {number} competition - The competition id
 * 
 * @returns {Promise<MutationResult<Competition>>} The request result
 */
export async function deleteCompetition (competition: number): Promise<MutationResult<void>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<void> = await authenticated.delete(`/api/competitions/${competition}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('deleteCompetition', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('deleteCompetition', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * Adds the specified team in the specified competition
 * 
 * @param {number} competition - The competition id
 * @param {number} team - The team id
 * 
 * @returns {Promise<MutationResult<Team>>} The request response
 */
export async function addTeamInCompetition (competition: number, team: number): Promise<MutationResult<Team>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Team> = await authenticated.post(`api/competitions/${competition}/team/${team}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('addTeamInCompetition', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('addTeamInCompetition', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * Removes the specified team from the competition
 * 
 * @param {number} competition - The competition id
 * @param {number} team - The team id
 * 
 * @returns {Promise<MutationResult<void>>} The request response
 */
export async function removeTeamFromCompetition (competition: number, team: number): Promise<MutationResult<void>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<void> = await authenticated.delete(`/api/competitions/${competition}/team/${team}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('removeTeamFromCompetition', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('removeTeamFromCompetition', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}