import {
  APP_FINISHED_LOADING,
  SET_SPORTS_IN_APP,
  SET_ROLES_IN_APP,
  AppFinishedLoadingAction,
  SetSportsInAppAction,
  SetRolesInAppAction,
  OpenAppModalAction,
  OPEN_APP_MODAL,
  CloseAppModalAction,
  CLOSE_APP_MODAL
} from './types';
import { logout } from '../auth'
import { setUserData } from '../auth';
import { authenticated, request } from '../../../config/axios';
import { AppThunk, User, Sport, Role } from '../../../shared/types';
import { AxiosResponse } from 'axios';

export const loadAppResources = (): AppThunk => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const authOptions = { headers: { Authorization: `Bearer ${auth.accessToken}` }};

    if (auth.accessToken) {
      try {        
        const { data: user }: AxiosResponse<User> = await authenticated.get('/api/users', authOptions);
        dispatch(setUserData(user));

      } catch (e) {
        dispatch(logout());
      }
    }

    const { data: sports }: AxiosResponse<Array<Sport>> = await request.get('/api/sports');
    dispatch(setSportsInApp(sports));
    
    const { data: roles }: AxiosResponse<Array<Role>> = await request.get('/api/roles');
    dispatch(setRolesInApp(roles));

    dispatch(appFinishedLoading());
  }
}

export const setSportsInApp = (sports: Array<Sport>): SetSportsInAppAction => {
  return {
    type: SET_SPORTS_IN_APP,
    payload: sports
  }
}

export const setRolesInApp = (roles: Array<Role>): SetRolesInAppAction => {
  return {
    type: SET_ROLES_IN_APP,
    payload: roles
  };
};

export const appFinishedLoading = () : AppFinishedLoadingAction => {
  return {
    type: APP_FINISHED_LOADING
  };
};

export const openAppModal = (title: string, component: React.ComponentType, props: object): OpenAppModalAction => {
  return {
    type: OPEN_APP_MODAL,
    payload: {
      title,
      component,
      props
    }
  }
};

export const closeAppModal = (): CloseAppModalAction => {
  return {
    type: CLOSE_APP_MODAL,
  }
};