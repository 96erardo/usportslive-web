import { request, authenticated } from '../../shared/config/axios';  
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { QueryResult, PaginatedResponse, Team, MutationResult } from '../../shared/types';
import Logger from 'js-logger';
import qs from 'qs';
import { useAuthStore } from '../auth/auth-store';

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
    }: {})
  }

  return filter;
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

  const team = {
    name: data.name,
    sportId: data.sport
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

/**
 * Updates the specified team
 * 
 * @param {UpdateTeamInput} data - The data to update the specified team
 * 
 * @returns {Promise<MutationResult<Team>>} The updated team
 */
export async function updateTeam (data: UpdateTeamInput): Promise<MutationResult<Team>> {
  const { accessToken } = useAuthStore.getState();
  const team = { name: data.name };

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

type FilterData = {
  sport?: number,
  q?: string,
}

type CreateTeamInput = {
  name?: string,
  sport?: number
}

type UpdateTeamInput = {
  id?: number,
  name?: string,
}