import { request, authenticated } from '../../shared/config/axios';
import qs from 'query-string';
import {
  LogoutUserAction,
  SetAuthTokensAction,
  SetUserDataAction,
  SET_AUTH_TOKENS,
  LOGOUT_USER,
  SET_USER_DATA
} from './auth-action-types';
import { AppThunk, User } from '../../shared/types';
import { RootState } from '../../shared/config/redux/reducers';
import { AxiosResponse } from 'axios';

/**
 * Exchanges the authorization code with access and refresh token 
 * with oauth server
 * 
 * @param code - Authorization code received from oauth server
 * @param grantType - Grant type used to authenticate
 * @param state - State received by oauth server
 * @param redirectUri - The url to redirect after successful login
 * @param clientId - The id of this client app
 * 
 * @returns {AppThunk<Promise<void>>}
 */
export const exchageCodeForToken = (
  code: string, 
  grantType: string, 
  state: String, 
  redirectUri: string, 
  clientId: string
): AppThunk<Promise<void>> => {
  return (dispatch): Promise<void> => {
    return request.post('/oauth/token', qs.stringify({
      code,
      grant_type: grantType,
      state,
      redirect_uri: redirectUri,
      client_id: clientId
    }), { 
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .then((res: AxiosResponse) => {
      dispatch(setAuthTokens(res.data.access_token, res.data.refresh_token));

      return authenticated.get('/api/users/', { headers: { Authorization: `Bearer ${res.data.access_token}`}});
    })
    .then((res: AxiosResponse) => {
      dispatch(setUserData(res.data));
    });
  };
};

/**
 * Logs the user out
 * 
 * @returns {AppThunk<Promise<void>>}
 */
export const signout = () : AppThunk<Promise<void>> => {
  return async (dispatch, getState): Promise<void> => {
    const { auth }: RootState = getState();
    let response = null;

    try {
      
      response = await request.post('/oauth/logout', { refreshToken: auth.refreshToken }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });
      
    } catch (e) {
      throw e;
    }

    if (response) {
      dispatch(logout());
    }
  }
}

/**
 * Created an action object based on the given tokens
 * 
 * @param {string} accessToken - User's access token
 * @param {string} refreshToken - User's refresh token
 * 
 * @returns {SetAuthTokensAction} The action object
 */
export const setAuthTokens = (accessToken: string, refreshToken: string) : SetAuthTokensAction => {
  return {
    type: SET_AUTH_TOKENS,
    payload: {
      accessToken,
      refreshToken
    }
  };
};

export const setUserData = (user: User): SetUserDataAction =>  {
  return {
    type: SET_USER_DATA,
    payload: user
  };
};

export const logout = (): LogoutUserAction => {
  return {
    type: LOGOUT_USER
  };
}; 