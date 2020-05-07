import { Sport, Role } from "../../../shared/types";

export const APP_FINISHED_LOADING = 'APP_FINISHED_LOADING';

export const SET_SPORTS_IN_APP = 'SET_SPORTS_IN_APP';

export const SET_ROLES_IN_APP = 'SET_ROLES_IN_APP';

export const OPEN_APP_MODAL = 'OPEN_APP_MODAL';

export const CLOSE_APP_MODAL = 'CLOSE_APP_MODAL';

export interface AppFinishedLoadingAction {
  type: typeof APP_FINISHED_LOADING
}

export interface SetSportsInAppAction {
  type: typeof SET_SPORTS_IN_APP
  payload: Array<Sport>
}

export interface SetRolesInAppAction {
  type: typeof SET_ROLES_IN_APP,
  payload: Array<Role>
}

export interface OpenAppModalAction {
  type: typeof OPEN_APP_MODAL,
  payload: {
    title: string,
    component: React.ComponentType,
    props: object,
    maxWidth: 'xs' | 'sm' | 'md' | 'lg'
  }
}

export interface CloseAppModalAction {
  type: typeof CLOSE_APP_MODAL,
}

export type AppActionTypes = 
  AppFinishedLoadingAction |
  SetSportsInAppAction |
  SetRolesInAppAction |
  OpenAppModalAction | 
  CloseAppModalAction
;