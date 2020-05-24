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
} from './app-action-types';
import { logout, setUserData } from '../auth/auth-actions';
import { authenticated, request } from '../../shared/config/axios';
import { AppThunk, PaginatedResponse, User, Sport, Role, Size } from '../../shared/types';
import { AxiosResponse } from 'axios';

export const loadAppResources = (): AppThunk => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const authOptions = { headers: { Authorization: `Bearer ${auth.accessToken}` }};

    if (auth.accessToken) {
      try {        
        const response: AxiosResponse<User> = await authenticated.get('/api/users', authOptions);
        if (response.status !== 200) {
          dispatch(logout());
        } else {
          dispatch(setUserData(response.data));
        }
      } catch (e) {
        dispatch(logout());
      }
    }

    const { data: sports }: AxiosResponse<PaginatedResponse<Sport>> = await request.get('/api/sports');
    dispatch(setSportsInApp(sports.items));
    
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

export const openAppModal = (title: string, component: React.ComponentType, props: object = {}, maxWidth: Size = 'sm'): OpenAppModalAction => {
  return {
    type: OPEN_APP_MODAL,
    payload: {
      title,
      component,
      props,
      maxWidth
    }
  }
};

export const closeAppModal = (): CloseAppModalAction => {
  return {
    type: CLOSE_APP_MODAL,
  }
};