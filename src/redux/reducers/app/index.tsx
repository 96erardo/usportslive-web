import {
  AppActionTypes,
  APP_FINISHED_LOADING,
} from '../../actions/app/types';
import { Reducer } from 'redux';

type AppState = {
  loading: boolean
}

const initialState: AppState = {
  loading: true,
};

const reducer: Reducer <AppState, AppActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case APP_FINISHED_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}

export default reducer;