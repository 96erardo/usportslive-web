import { request, authenticated } from '../../shared/config/axios';
import { useAuthStore } from '../auth/auth-store';
import { Sport, PaginatedResponse, MutationResult, QueryResult } from '../../shared/types';
import Logger from 'js-logger';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import qs from 'qs';

/**
 * Fetches the sports from the api
 * 
 * @param {number} page - The page to filter the results from
 * 
 * @returns {Promise} The request result
 */
export async function fetchSports (
  page: number = 1, 
  include: Array<string> = [], 
  data = {}, 
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Sport>>> {
  const first: number = 10;
  const skip: number = first * (page - 1);
  const filters = createFilter(data);
  const query: string = qs.stringify({ first, skip, include, filters }, { encode: false, arrayFormat: 'brackets' })
  
  try {
    const res: AxiosResponse<PaginatedResponse<Sport>> = await request.get(`/api/sports?${query}`, {
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

/**
 * Created a filter for fetching sports
 * 
 * @param {SportFilter} data - The data to create the filter from
 * 
 * @returns {object} The filter
 */
function createFilter (data: SportFilter) {
  const filters = {
    ...(data.q ? {
      name: { like: data.q }
    } : {})    
  }
  ;
  
  return filters; 
}

/**
 * Creates a new sport
 * 
 * @param {CreateSportInput} data - Input needed to create the sport
 * 
 * @returns {Promise<MutationResult<Sport>>} The created sport
 */
export async function createSport (data: CreateSportInput): Promise<MutationResult<Sport>> {
  const { accessToken } = useAuthStore.getState();

  const sport = {
    name: data.name,
    color: data.color
  }

  try {
    const res: AxiosResponse<Sport> = await authenticated.post(`/api/sports`, sport, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('createSport', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('createSport', e);

    return [e];
  }
}

/**
 * Updates the specified sport
 * 
 * @param {UpdateSportInput} data - The data to update the sport
 * 
 * @returns {Promise<MutationResult<Sport>>} The request response
 */
export async function updateSport (data: UpdateSportInput): Promise<MutationResult<Sport>> {
  const { accessToken } = useAuthStore.getState();

  const sport = {
    name: data.name,
    color: data.color,
    teamId: data.team
  };

  console.log('sport', sport);

  try {
    const res: AxiosResponse<Sport> = await authenticated.patch(`/api/sports/${data.id}`, sport, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updateSport', res.data);

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
 * Assigns a team as the official one to a sport
 * 
 * @param {number} sport - The sport to update
 * @param {number} team - The team to assign it
 * 
 * @returns {Promise<MutationResult<Sport>>} The request result
 */
export async function assignTeamToSport (sport: number, team: number): Promise<MutationResult<Sport>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Sport> = await authenticated.patch(`/api/sports/${sport}`, {
      teamId: team
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('assignTeamToSport', res.data);

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
 * Deletes the specified sport
 * 
 * @param {number} sport - The sport to delete
 * 
 * @returns {Promise<MutationResult<boolean>>}
 */
export async function deleteSport (sport: number): Promise<MutationResult<boolean>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<null> = await authenticated.delete(`/api/sports/${sport}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('deleteSport', res.data);

    return [null, true];

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

export type CreateSportInput = {
  name: string,
  color: string
}

export type UpdateSportInput = {
  id: number,
  name: string,
  color: string,
  team: number | null | undefined
}

export type SportFilter = {
  q?: string
}