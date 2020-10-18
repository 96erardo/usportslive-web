import { request, authenticated } from '../../shared/config/axios';
import { User, PaginatedResponse, QueryResult, Role, MutationResult } from '../../shared/types';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import Logger from 'js-logger';
import { useAppStore } from '../app/app-store';
import { useAuthStore } from '../auth/auth-store';
import qs from 'qs';

/**
 * Fetches the users list
 * 
 * @param {number} page - The page to fetch the items from
 * @param {Array<string>} include - The relations to include in each user
 * @param {object} data - The data to create the filters from
 * @param {CancelTokenSource} source - The cancel token to cancel de request if needed
 * 
 * @return {Promise<QueryResult<PaginatedResponse<Team>>>} The list of teams
 */
export async function fetchUsers (
  page: number = 1,
  include: Array<string> = [],
  data: FilterData = {},
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<User>>> {
  const first = 10;
  const skip = first * (page - 1);
  const filters = createFilter(data);
  const { accessToken } = useAppStore.getState();
  const query = qs.stringify({ first, skip, include, filters }, { encode: false, arrayFormat: 'brackets' })

  try {
    const res: AxiosResponse<PaginatedResponse<User>> = await request.get(`/api/users?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchUsers', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchUsers(Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchUsers', e);

    return [e];
  }
}

function createFilter (data: FilterData) {
  return {
    ...(data.q ? {
      person: { 
        name: { like: data.q }
      }
    } : {})
  };
}

export type FilterData = {
  q?: string,
}

/**
 * Fetches the specified user
 * 
 * @param {number} id - The id of the user to fetch
 * @param {Array<string>} include - Relations to include in the request
 * 
 * @returns {User} The fetched user
 */
export async function fetchUser (id: number = 0, include: Array<string> = []) {
  const { accessToken: userAccessToken } = useAuthStore.getState();
  const { accessToken: clientAccessToken } = useAppStore.getState();

  if (id === 0) {

    try {
      const response: AxiosResponse<{ user: User}> = await authenticated.get(`/api/users/${id}`, {
        params: { include },
        headers: { Authorization: `Bearer ${userAccessToken || clientAccessToken}` }
      });

      Logger.info('fetchUser', response.data);

      return [null, response.data];

    } catch (e) {
      Logger.error('fetchUser', e);
      
      return [e];
    }
  }
  

  try {
    const response: AxiosResponse<{ user: User }> = await request.get(`/api/users/${id}`, { 
      params: { include },
      headers: { Authorization: `Bearer ${clientAccessToken}` },
    });

    Logger.info('fetchUser', response.data);

    return [null, response.data];
  } catch (e) {
    Logger.error('fetchUser', e);

    return [e];
  }
}

/**
 * Fetches a list of roles
 * 
 * @param {number} page - The page that is going to be fetched
 * 
 * @returns {Promise} The request result
 */
export async function fetchRoles (page: number = 1) {
  const { accessToken } = useAppStore.getState();

  try {
    const response: AxiosResponse<PaginatedResponse<Role>> = await request.get(`/api/roles`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    Logger.info('fetchRoles', response.data);

    return [null, response.data];

  } catch (e) {
    Logger.error('fetchRoles', e);

    return [e];
  }
}

/**
 * Updates the specified user role
 * 
 * @param {number} user - The user id
 * @param {number} role - The role id
 * 
 * @returns {Promise<MutationResult<User>>} The request result
 */
export async function updateUserRole (user: number, role: number): Promise<MutationResult<User>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<User> = await authenticated.patch(`/api/users/${user}`, {
      roleId: role,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updateUserRole', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('updateUserRole', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}