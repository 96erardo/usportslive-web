import { User } from '../../shared/types';

export const SET_AUTH_TOKENS = 'SET_AUTH_TOKENS';

export const SET_USER_DATA = 'SET_USER_DATA';

export const LOGOUT_USER = 'LOGOUT_USER';

export interface AuthenticationState {
  isLoggedIn: boolean,
  accessToken: string,
  refreshToken: string,
  user: User | null
}

export interface SetAuthTokensAction {
  type: typeof SET_AUTH_TOKENS,
  payload: {
    accessToken: string,
    refreshToken: string
  }
}

export interface SetUserDataAction {
  type: typeof SET_USER_DATA,
  payload: User
}

export interface LogoutUserAction {
  type: typeof LOGOUT_USER
}


export type AuthenticationActionTypes = 
  SetAuthTokensAction |
  SetUserDataAction |
  LogoutUserAction
;