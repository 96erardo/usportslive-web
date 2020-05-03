import { request } from '../../config/axios';
import { Sport } from '../../shared/types';
/**
 * Fetches the sports from the api
 * 
 * @param page - The page to filter the results from
 * 
 * @returns {Promise<Array<Sport>>}
 */
export async function getSports (page = 0): Promise<Array<Sport>> {
  const res = await request.get(`/api/sports?page=${page}`);

  return res.data;
}