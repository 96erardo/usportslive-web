import {
  APP_FINISHED_LOADING,
  SET_SPORTS_IN_APP,
  AppFinishedLoadingAction,
  SetSportsInAppAction
} from './types';
import { setUserData } from '../auth';
import { authenticated, request } from '../../../config/axios';
import { AppThunk, User, Sport } from '../../../shared/types';
import { AxiosResponse } from 'axios';

export const loadAppResources = (): AppThunk => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const authOptions = { headers: { Authorization: `Bearer ${auth.accessToken}` }};

    if (auth.accessToken) {
      const { data: user }: AxiosResponse<User> = await authenticated.get('/api/users', authOptions);
      dispatch(setUserData(user));
    }

    const { data: sports }: AxiosResponse<Array<Sport>> = await request.get('/api/sports');

    dispatch(setSportsInApp(sports));

    dispatch(appFinishedLoading());
  }
}

export const setSportsInApp = (sports: Array<Sport>): SetSportsInAppAction => {
  return {
    type: SET_SPORTS_IN_APP,
    payload: sports
  }
}

export const appFinishedLoading = () : AppFinishedLoadingAction => {
  return {
    type: APP_FINISHED_LOADING
  };
};