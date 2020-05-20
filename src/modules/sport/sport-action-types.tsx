import { Sport } from '../../shared/types';

export const FETCH_SPORTS = 'FETCH_SPORTS';

export const FETCH_SPORTS_ERROR = 'FETCH_SPORTS_ERROR';

export const CREATE_SPORT = 'CREATE_SPORT';

export const CREATE_SPORT_ERROR = 'CREATE_SPORT_ERROR';

export const UPDATE_SPORT = 'UPDATE_SPORT';

export const UPDATE_SPORT_ERROR = 'UPDATE_SPORT_ERROR';

export interface FetchSportsAction {
  type: typeof FETCH_SPORTS,
  payload: Array<Sport>
}

export interface FetchSportsErrorAction {
  type: typeof FETCH_SPORTS_ERROR,
  payload: Error
}

export interface CreateSportAction {
  type: typeof CREATE_SPORT,
  payload: Sport
}

export interface CreateSportErrorAction {
  type: typeof CREATE_SPORT_ERROR,
  payload: Error
}

export interface UpdateSportAction {
  type: typeof UPDATE_SPORT,
  payload: Sport
}

export interface UpdateSportErrorAction {
  type: typeof UPDATE_SPORT_ERROR,
  payload: Error
}

export type SportActionTypes = 
  FetchSportsAction | 
  FetchSportsErrorAction |
  CreateSportAction | 
  CreateSportErrorAction | 
  UpdateSportAction |
  UpdateSportErrorAction
;