import {
  APP_FINISHED_LOADING,
  AppFinishedLoadingAction
} from './types';
import {
  setUserData
} from '../auth/index'
import { authenticated } from '../../../config/axios';
import { AppThunk, User } from '../../../shared/types';
import { AxiosResponse } from 'axios';


export const loadAppResources = (): AppThunk => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const authOptions = { headers: { Authorization: `Bearer ${auth.accessToken}` }};

    if (auth.accessToken) {
      const { data: user }: AxiosResponse<User> = await authenticated.get('/api/users', authOptions);
      dispatch(setUserData(user));
    }

    dispatch(appFinishedLoading());
  }
}

export const appFinishedLoading = () : AppFinishedLoadingAction => {
  return {
    type: APP_FINISHED_LOADING
  };
};