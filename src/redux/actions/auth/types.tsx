export const AUTH_LOGIN = 'AUTH_LOGIN';

export interface Authentication {
  isLoggedIn: boolean,
  accessToken: string,
  refreshToken: string,
  user: object | null,
}

interface AuthenticateUserAction {
  type: typeof AUTH_LOGIN,
  payload: {
    user: object,
    accessToken: string,
    refreshToken: string,
  }
}

export type AuthenticationActionTypes = AuthenticateUserAction;