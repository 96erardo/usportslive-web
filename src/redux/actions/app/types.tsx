export const APP_FINISHED_LOADING = 'APP_FINISHED_LOADING';

export interface AppFinishedLoadingAction {
  type: typeof APP_FINISHED_LOADING
}

export type AppActionTypes = 
  AppFinishedLoadingAction
;