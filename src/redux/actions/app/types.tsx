import { Sport, Role } from "../../../shared/types";

export const APP_FINISHED_LOADING = 'APP_FINISHED_LOADING';

export const SET_SPORTS_IN_APP = 'SET_SPORTS_IN_APP';

export const SET_ROLES_IN_APP = 'SET_ROLES_IN_APP';

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

export type AppActionTypes = 
  AppFinishedLoadingAction |
  SetSportsInAppAction |
  SetRolesInAppAction
;