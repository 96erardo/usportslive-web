import { request, authenticated } from '../../shared/config/axios';
import { User, PaginatedResponse, Role } from '../../shared/types';
import { AxiosResponse } from 'axios';
import Logger from 'js-logger';
import { useAuthStore } from '../auth/auth-store';

/**
 * Fetches the specified user
 * 
 * @param {number} id - The id of the user to fetch
 * @param {Array<string>} include - Relations to include in the request
 * 
 * @returns {User} The fetched user
 */
export async function fetchUser (id: number = 0, include: Array<string> = []) {
  if (id === 0) {
    const { accessToken } = useAuthStore.getState();

    try {
      const response: AxiosResponse<{ user: User}> = await authenticated.get(`/api/users/${id}`, {
        params: { include },
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      Logger.info('fetchUser', response.data);

      return [null, response.data];

    } catch (e) {
      Logger.error('fetchUser', e);

      return [e];
    }
  }

  try {
    const response: AxiosResponse<{ user: User }> = await request.get(`/api/users/${id}`, { params: { include }});

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
  try {
    const response: AxiosResponse<PaginatedResponse<Role>> = await request.get(`/api/roles`);

    Logger.info('fetchRoles', response.data);

    return [null, response.data];

  } catch (e) {
    Logger.error('fetchRoles', e);

    return [e];
  }
}