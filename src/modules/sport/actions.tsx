import { request, authenticated } from '../../config/axios';
import { Sport } from '../../shared/types';
import { RootState } from '../../redux/reducers'
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

  return res.data;
}

export async function updateSport (data: UpdateSport): Promise<void> {
  
};

type CreateSport = {
  name: string,
  teamId: number | string | null
}

type UpdateSport = {
  id: number,
  name: string,
  teamId: number | null,
};