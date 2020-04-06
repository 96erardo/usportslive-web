import {
  AppActionTypes,
  APP_FINISHED_LOADING,
  SET_SPORTS_IN_APP,
  SET_ROLES_IN_APP
} from '../../actions/app/types';
import { Reducer } from 'redux';
import { Sport, Role } from '../../../shared/types';

type AppState = {
  loading: boolean,
  sports: Array<Sport>,
  roles: Array<Role>
}

const initialState: AppState = {
  loading: true,
  sports: [],
  roles: []
};

const reducer: Reducer <AppState, AppActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case APP_FINISHED_LOADING:
      return {
        ...state,
        loading: false,
      };
    case SET_SPORTS_IN_APP:
      return {
        ...state,
        sports: [
          ...state.sports,
          ...action.payload
        ]
      };
    case SET_ROLES_IN_APP:
      return {
        ...state,
        roles: action.payload,
      }
    default:
      return state;
  }
}

export default reducer;