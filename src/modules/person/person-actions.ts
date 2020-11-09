import { request, authenticated } from '../../shared/config/axios';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import { MutationResult, PaginatedResponse, Person, QueryResult, PlayedSports } from '../../shared/types';
import { useAppStore } from '../app/app-store';
import Logger from 'js-logger';
import qs from 'qs';
import { useAuthStore } from '../auth/auth-store';

/**
 * Fetches the list of persons on the app
 * 
 * @param {number} page - The page to fetch the persons from
 * @param {Array<string>} include - The relations to include with each person
 * @param {PersonFilterData} data - The data user to create filters for the query
 * @param {CancelTokenSource} source - token to cancel the request if needed
 */
export async function fetchPersons (
  page: number = 1, 
  include: Array<string> = [], 
  data: PersonFilterData = {}, 
  source?: CancelTokenSource
) {
  const first: number = 20;
  const skip: number = first * (page - 1);
  const filters = createFilter(data);
  const { accessToken } = useAppStore.getState();
  const query: string = qs.stringify({ first, skip, include, filters }, { encode: false, arrayFormat: 'brackets' })
  
  try {
    const res: AxiosResponse<PaginatedResponse<Person>> = await request.get(`/api/persons?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
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

function createFilter (data: PersonFilterData) {
  return {
    ...(data.q ? {
      name: { like: data.q }
    } : {})
  };
}

export type PersonFilterData = {
  q?: string
};

/**
 * Fetches the specified person
 * 
 * @param {number} id - The id of the person to fetch
 * @param {Array<string>} include - The relations to include with the person
 * @param {CancelTokenSource} source - The token to cancel the request if needed
 * 
 * @returns {Promise<QueryResult<{ person: Person | null }>>} The request result
 */
export async function fetchPerson (
  id: number,
  include: Array<string> = [],
  source?: CancelTokenSource
): Promise<QueryResult<{ person: Person | null }>> {

  const { accessToken } = useAppStore.getState();
  const query: string = qs.stringify({ include }, { encode: false, arrayFormat: 'brackets' });

  try {
    const res: AxiosResponse<{ person: Person | null }> = await request.get(`/api/persons/${id}?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchPerson', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.info('Request canceled', e);

      return [e, true];
    }
    
    Logger.error('fetchPerson', e);

    return [e];
  }
}

/**
 * Fetches a person by its id or username
 * 
 * @param {string} key - The id or username to fetch the person from
 * @param {Array<string>} include - The relations to include with the person
 * @param {CancelTokenSource} source - Token to cancel the request if needed
 * 
 * @returns {Promise<QueryResult<{ person: Person | null }>>} The requested person
 */
export async function fetchPersonByIdOrUser (
  key: string,
  include: Array<string> = [],
  source?: CancelTokenSource
): Promise<QueryResult<{ person: Person | null }>> {
  
  const { accessToken } = useAppStore.getState();
  const id = parseInt(key);
  
  const query: string = qs.stringify({
    filters: Number.isNaN(id) ? {
      user: { username: { eq: key } }
    } : {
      id: { eq: id }
    },
    include
  })

  try {
    const res: AxiosResponse<PaginatedResponse<Person>> = await request.get(`/api/persons?${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchPersonByIdOrUser', res.data);

    if (res.data.count === 0)
      return [null, false, { person: null }];

    return [null, false, { person: res.data.items[0] }];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.info('Request canceled', e);

      return [e, true];
    }
    
    Logger.error('fetchPersonByIdOrUser', e);

    return [e];
  }
}

/**
 * Updates the specified person avatar
 * 
 * @param {number} id - The id of the person to update the avatar
 * @param {number} photo - The image id
 * 
 * @returns {Promise<MutationResult<Person>>} The request result
 */
export async function updateAvatar (id: number, photo: number): Promise<MutationResult<Person>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Person> = await authenticated.patch(`/api/persons/${id}`, {
      avatarId: photo
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updateAvatar', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('updateAvatar', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')];
      
    } else {
      return [e];
    }
  }
}

/**
 * Fetches the specifid person participation in sports
 * 
 * @param {string} id - The id of the person to fetch
 * @param {CancelTokenSource} source - Token to cancel the request if needed
 * 
 * @returns {Promise<QueryResult<PaginatedResponse<PlayedSports>>>} The request response
 */
export async function fetchPersonsPlayedSports (
  id: number,
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<PlayedSports>>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<PaginatedResponse<PlayedSports>> = await authenticated.get(`/api/persons/${id}/played`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchPersonsPlayedSports', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.info('fetchPersonsPlayedSports (Request canceled)', e);

      return [e, true];
    }
    
    Logger.error('fetchPersonsPlayedSports', e);

    return [e];
  }
}