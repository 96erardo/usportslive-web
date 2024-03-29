import { request, authenticated } from '../../shared/config/axios';  
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { QueryResult, PaginatedResponse, Team, MutationResult, GamePerformance, Game } from '../../shared/types';
import Logger from 'js-logger';
import { useAuthStore } from '../auth/auth-store';
import { useAppStore } from '../app/app-store';
import qs from 'qs';

/**
 * Fetches the specified team
 * 
 * @param {number} id - The id of the team to fetch
 * @param {Array<string>} include - Relations to include with the team
 * @param {CancelTokenSource} source - The cancel token to cancel de request if needed
 * 
 * @returns {Promise<QueryResult<{ team: Team|null }>>} The specified team
 */
export async function fetchTeam (
  id: number, 
  include: Array<string> = [], 
  source?: CancelTokenSource
): Promise<QueryResult<{ team: Team|null }>> {
  
  const { accessToken } = useAppStore.getState();
  const query = qs.stringify({ include });

  try {
    const res: AxiosResponse<{ team: Team }> = await request.get(`/api/teams/${id}?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchTeam', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchTeam (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchTeam', e);

    return [e];
  }
}

/**
 * Fetches the team list
 * 
 * @param {number} page - The page to fetch the items from
 * @param {Array<string>} include - The relations to include in each team
 * @param {object} data - The data to create the filters from
 * @param {CancelTokenSource} source - The cancel token to cancel de request if needed
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
  const { accessToken } = useAppStore.getState();
  const query = qs.stringify({ first, skip, include, filters }, { encode: false, arrayFormat: 'brackets' })

  try {
    const res: AxiosResponse<PaginatedResponse<Team>> = await request.get(`/api/teams?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
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

/**
 * Creates the filter
 * 
 * @param {FilterData} data - The data to create the filters
 * 
 * @returns {object} The filters to fetch the teams
 */
function createFilter (data: FilterData) {
  const filter = {
    ...(data.sport ? {
      sport: { id: { eq: data.sport } }
    } : {}),
    ...(data.q ? {
      name: { like: data.q } 
    }: {}),
    ...(data.competition ? {
      competition: { id: { eq: data.competition } }
    } : {})
  }

  return filter;
}

export type FilterData = {
  sport?: number,
  q?: string,
  competition?: number,
}

/**
 * Creates a new team
 * 
 * @param {CreateTeamInput} data - The data to create the team from
 * 
 * @returns {Promise<MutationResult<Team>>} The created team 
 */
export async function createTeam (data: CreateTeamInput): Promise<MutationResult<Team>> {
  const { accessToken } = useAuthStore.getState();

  const team: { name: string, sportId?: number | string, logoId?: number | string } = {
    name: data.name,
    sportId: data.sport,
  }

  if (data.logo) {
    team.logoId = data.logo;
  }

  try {
    const res: AxiosResponse<Team> = await authenticated.post(`/api/teams`, team, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('createTeam', res.data);

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

type CreateTeamInput = {
  name: string,
  sport?: number | string,
  logo?: number | null,
}

/**
 * Updates the specified team
 * 
 * @param {UpdateTeamInput} data - The data to update the specified team
 * 
 * @returns {Promise<MutationResult<Team>>} The updated team
 */
export async function updateTeam (data: UpdateTeamInput): Promise<MutationResult<Team>> {
  const { accessToken } = useAuthStore.getState();
  const team = { 
    name: data.name,
    logoId: data.logo
  };

  try {
    const res: AxiosResponse<Team> = await authenticated.patch(`/api/teams/${data.id}`, team, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updateTeam', res.data);

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

type UpdateTeamInput = {
  id?: number,
  name?: string,
  logo: number | null,
}

/**
 * Updates the specified team name
 * 
 * @param {number} id - Id of the team to update
 * @param {string} name - New name of the team
 * 
 * @returns {Promise<MutationResult<Team>>} The updated team
 */
export async function updateTeamName (id: number, name: string): Promise<MutationResult<Team>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Team> = await authenticated.patch(`api/teams/${id}`, { name }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updateTeamName', res.data);

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
 * Deletes the specified team
 * 
 * @param {number} id - The team to delete
 * 
 * @returns {Promise<MutationResult<boolean>>}
 */
export async function deleteTeam (id: number): Promise<MutationResult<boolean>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse = await authenticated.delete(`/api/teams/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('deleteTeam', res.data);

    return [null, true];

  } catch (e) {
    Logger.error('deleteTeam', e);

    return [e];
  }
}

/**
 * 
 * @param {number} team - The team id
 * @param {number} game - The game id
 * @param {CancelTokenSource} source - Cancel token source
 * 
 * @returns {Promise}
 */
export async function fetchTeamPerformance (
  team: number,
  game: number,
  source?: CancelTokenSource
): Promise<QueryResult<Array<GamePerformance>>> {
  const { accessToken } = useAppStore.getState();

  try {
    const res: AxiosResponse<Array<GamePerformance>> = await request.get(`/api/teams/${team}/game/${game}/performance`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchTeamPerformance', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchTeamPerformance (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchTeamPerformance', e);

    return [e];
  }
}

/**
 * Fetches the games of the specified team
 * 
 * @param {number} page - The page of results
 * @param {number} team - The team to fetch the games from
 * @param {string} orderBy - The way to order the results
 * @param {CancelTokenSource} source - The token source
 * 
 * @returns {Promise<QueryResult<PaginatedResponse<Game>>>} The request result
 */
export async function fetchTeamGames (
  page: number = 1,
  team: number,
  include: Array<string> = [],
  orderBy: string,
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Game>>> {
  const { accessToken } = useAppStore.getState();

  const first = 10;
  const skip = first * (page - 1);
  const query = qs.stringify({
    first,
    skip,
    include,
    orderBy
  }, { encode: false, arrayFormat: 'brackets' })

  try {
    const res: AxiosResponse<PaginatedResponse<Game>> = await request.get(`/api/teams/${team}/games?${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchTeamGames', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchTeamPerformance (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchTeamPerformance', e);

    return [e];
  }
}