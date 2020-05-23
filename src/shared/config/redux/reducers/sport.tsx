import {
  SportActionTypes,
  FETCH_SPORTS,
  FETCH_SPORTS_ERROR,
  CREATE_SPORT,
  CREATE_SPORT_ERROR,
  UPDATE_SPORT,
  UPDATE_SPORT_ERROR,
  DELETE_SPORT,
  DELETE_SPORT_ERROR
} from '../../../../modules/sport/sport-action-types';
import { Reducer } from 'redux';
import { Sport } from '../../../types';

interface State  {
  [key: string]: { success: any, error: Error | null },
  fetchSports: { success: Array<Sport>, error: Error | null },
  createSport: { success: Sport | null, error: Error | null },
  updateSport: { success: Sport | null, error: Error | null },
  deleteSport: { success: number, error: Error | null },
}

const initialState: State = {
  fetchSports: { success: [], error: null },
  createSport: { success: null, error: null },
  updateSport: { success: null, error: null },
  deleteSport: { success: 0, error: null }
}

const reducer: Reducer<State, SportActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SPORTS:
      return {
        ...state,
        fetchSports: {
          ...state.fetchSports,
          success: action.payload
        }
      }
    case FETCH_SPORTS_ERROR:
      return {
        ...state,
        fetchSports: {
          ...state.fetchSports,
          error: action.payload,
        }
      };
    case CREATE_SPORT:
      return {
        ...state,
        createSport: {
          ...state.createSport,
          success: action.payload
        }
      };
    case CREATE_SPORT_ERROR:
      return {
        ...state,
        createSport: {
          ...state.createSport,
          error: action.payload
        }
      };
    case UPDATE_SPORT:
      return {
        ...state,
        updateSport: {
          ...state.updateSport,
          success: action.payload
        }
      };
    case UPDATE_SPORT_ERROR:
      return {
        ...state,
        updateSport: {
          ...state.updateSport,
          error: action.payload
        }
      };
    case DELETE_SPORT:
      return {
        ...state,
        deleteSport: {
          ...state.deleteSport,
          success: action.payload
        }
      }
    case DELETE_SPORT_ERROR:
      return {
        ...state,
        deleteSport: {
          ...state.deleteSport,
          error: action.payload
        }
      }
    default:
      return state;
  }
}

export default reducer;