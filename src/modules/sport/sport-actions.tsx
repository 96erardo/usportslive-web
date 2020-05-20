import { request, authenticated } from '../../shared/config/axios';
import { Sport, AppThunk } from '../../shared/types';
import { RootState } from '../../shared/config/redux/reducers'
import Logger from 'js-logger';
import {
  FETCH_SPORTS,
  FETCH_SPORTS_ERROR,
  FetchSportsAction,
  FetchSportsErrorAction,
  CREATE_SPORT,
  CREATE_SPORT_ERROR,
  CreateSportAction,
  CreateSportErrorAction,
  UPDATE_SPORT,
  UPDATE_SPORT_ERROR,
  UpdateSportAction,
  UpdateSportErrorAction
} from './sport-action-types';
import store from '../../shared/config/redux';

/**
 * Fetches the sports from the api
 * 
 * @param {number} page - The page to filter the results from
 * 
 * @returns {AppThunk<Promise<void>>}
 */
export function getSports (page: number = 0): AppThunk<Promise<void>> {
  return async (dispatch): Promise<void> => {
    let res = null;

    try {

      res = await request.get(`api/sports?page=${page}`);

    } catch (e) {
      Logger.error('getSports', e);

      dispatch(fetchSportsError(e));

      return;
    }

    Logger.info('getSports', res.data);

    dispatch(fetchSports(res.data));
  }
}

/**
 * Creates a new Sport
 * 
 * @param {object} data - The data passed to the function
 * @param {string} data.name - The name of the new sport
 * @param {number|string|null} data.teamId - The id of the team assigned to this sport
 * 
 * @returns {AppThunk<Promise<void>>}
 */
export function addSport (data: CreateSport): AppThunk<Promise<void>> {
  return async (dispatch, getState): Promise<void> => {
    const { auth }: RootState = getState();
    let res = null;

    try {
      
      res = await authenticated.post('/api/sports', {
        name: data.name,
        teamId: data.teamId
      }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });

    } catch (e) {
      Logger.error('addSport', e);

      dispatch(createSportError(e));

      return;
    }

    Logger.info('addSport', res);

    dispatch(createSport(res.data));
  }
}

/**
 * Edits a sport
 * 
 * @param {UpdateSport} data - The data to update
 * 
 * @returns {AppThunk<Promise<void>>}
 */
export function editSport (data: UpdateSport): AppThunk<Promise<void>> {
  return async (dispatch, getState): Promise<void> => {
    const { auth }: RootState = getState();
    let res = null;

    try {
      
      res = await authenticated.patch(`/api/sports/${data.id}`, {
        name: data.name,
        teamId: data.teamId,
      }, { 
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });
    } catch (e) {
      Logger.error('editSport', e);

      dispatch(updateSportError(e));
      
      return;
    }

    Logger.info('updateSport', res);

    dispatch(updateSport(res.data));
  }
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

function fetchSports (data: Array<Sport>): FetchSportsAction {
  return {
    type: FETCH_SPORTS,
    payload: data
  }
}

function fetchSportsError (err: Error): FetchSportsErrorAction {
  return {
    type: FETCH_SPORTS_ERROR,
    payload: err
  }
}

function createSport (data: Sport): CreateSportAction {
  return {
    type: CREATE_SPORT,
    payload: data
  }
}

function createSportError (err: Error): CreateSportErrorAction {
  return {
    type: CREATE_SPORT_ERROR,
    payload: err
  }
}

function updateSport (data: Sport): UpdateSportAction {
  return {
    type: UPDATE_SPORT,
    payload: data
  }
}

function updateSportError (err: Error): UpdateSportErrorAction {
  return {
    type: UPDATE_SPORT_ERROR,
    payload: err
  }
}