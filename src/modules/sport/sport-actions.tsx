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
  UpdateSportErrorAction,
  DELETE_SPORT,
  DELETE_SPORT_ERROR,
  DeleteSportAction,
  DeleteSportErrorAction
} from './sport-action-types';

/**
 * Fetches the sports from the api
 * 
 * @param {number} page - The page to filter the results from
 * 
 * @returns {AppThunk<Promise<void>>}
 */
export function fetchSports (page: number = 0): AppThunk<Promise<void>> {
  return async (dispatch): Promise<void> => {
    let res = null;

    try {

      res = await request.get(`api/sports?page=${page}`);

    } catch (e) {
      Logger.error('fetchSports', e);

      dispatch(fetchError(e));

      return;
    }

    Logger.info('fetchSports', res);

    dispatch(fetch(res.data));
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
export function createSport (data: CreateSport): AppThunk<Promise<void>> {
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
      Logger.error('createSport', e.response);

      dispatch(createError(e));

      return;
    }

    Logger.info('createSport', res);

    dispatch(create(res.data));
  }
}

/**
 * Edits a sport
 * 
 * @param {UpdateSport} data - The data to update
 * 
 * @returns {AppThunk<Promise<void>>}
 */
export function updateSport (data: UpdateSport): AppThunk<Promise<void>> {
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
      Logger.error('updateSport', e.response);

      dispatch(updateError(e));
      
      return;
    }

    Logger.info('updateSport', res);

    dispatch(update(res.data));
  }
};

/**
 * Deletes the specified sport from the platform
 * 
 * @param {number|string} id - Id of the sport about to delete
 * 
 * @returns {Promise<void>}
 */
export function deleteSport (id: number): AppThunk<Promise<void>> {
  return async (dispatch, getState): Promise<void> => {
    const { auth }: RootState = getState();
    let res = null;

    try {

      res = await authenticated.delete(`/api/sports/${45}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });

    } catch (e) {
      Logger.error('deleteSport', e.response);

      dispatch(deleteError(e));

      return;
    }

    Logger.info('deleteSport', res);

    dispatch(deletes(id));
  }
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

function fetch (data: Array<Sport>): FetchSportsAction {
  return {
    type: FETCH_SPORTS,
    payload: data
  }
}

function fetchError (err: Error): FetchSportsErrorAction {
  return {
    type: FETCH_SPORTS_ERROR,
    payload: err
  }
}

function create (data: Sport): CreateSportAction {
  return {
    type: CREATE_SPORT,
    payload: data
  }
}

function createError (err: Error): CreateSportErrorAction {
  return {
    type: CREATE_SPORT_ERROR,
    payload: err
  }
}

function update (data: Sport): UpdateSportAction {
  return {
    type: UPDATE_SPORT,
    payload: data
  }
}

function updateError (err: Error): UpdateSportErrorAction {
  return {
    type: UPDATE_SPORT_ERROR,
    payload: err
  }
}

function deletes (id: number): DeleteSportAction {
  return {
    type: DELETE_SPORT,
    payload: id,
  }
}

function deleteError (err: Error): DeleteSportErrorAction {
  return {
    type: DELETE_SPORT_ERROR,
    payload: err,
  }
}