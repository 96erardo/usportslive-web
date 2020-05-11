import { request, authenticated } from '../../config/axios';
import { Sport } from '../../shared/types';
import { RootState } from '../../redux/reducers'
import Logger from 'js-logger';
import store from '../../redux';

/**
 * Fetches the sports from the api
 * 
 * @param {number} page - The page to filter the results from
 * 
 * @returns {Promise<Array<Sport>>}
 */
export async function getSports (page = 0): Promise<Array<Sport>> {
  const res = await request.get(`/api/sports?page=${page}`);

  Logger.info('getSports', res);

  return res.data;
}

/**
 * Creates a new Sport
 * 
 * @param {object} data - The data passed to the function
 * @param {string} data.name - The name of the new sport
 * @param {number|string|null} data.teamId - The id of the team assigned to this sport
 * 
 * @returns {Promise<Sport>}
 */
export async function createSport (data: CreateSport): Promise<Sport> {
  const { auth }: RootState = store.getState();
  
  const res = await authenticated.post('/api/sports', {
    name: data.name,
    teamId: data.teamId
  }, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  });

  Logger.info('createSport', res);

  return res.data;
}

export async function updateSport (data: UpdateSport): Promise<void> {
  const { auth }: RootState = store.getState();

  const res = await authenticated.patch(`/api/sports/${data.id}`, {
    name: data.name,
    teamId: data.teamId,
  }, { 
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  });

  Logger.info('updateSport', res);

  return res.data;
};

/**
 * Deletes the specified sport from the platform
 * 
 * @param {number|string} id - Id of the sport about to delete
 * 
 * @returns {Promise<void>}
 */
export async function deleteSport (id: number): Promise<void> {
  /**
   * Functionality missing because it has to be defined what should
   * happen when a sport is deleted. This functionality is going to be left here
   * to simulate the process of deletition
   */

  return new Promise((resolve) => {
    setTimeout(() => resolve(), 2000);
  });
}

type CreateSport = {
  name: string,
  teamId: number | string | null
}

type UpdateSport = {
  id: number,
  name: string,
  teamId: number | null,
};