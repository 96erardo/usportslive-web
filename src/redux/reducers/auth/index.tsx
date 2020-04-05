import { 
  AuthenticationState,
  AuthenticationActionTypes,
  SET_AUTH_TOKENS,
  SET_USER_DATA,
} from '../../actions/auth/types';

const initialState : AuthenticationState = {
  isLoggedIn: false,
  accessToken: '',
  refreshToken: '',
  user: null,
}

/**
 * Authentication reducer
 * 
 * @param {State} state - The previous state of this reducer
 * @param {object} action - The action to execute
 * 
 * @returns {AuthenticationState} Next reducer state
 */
export default function (state: AuthenticationState = initialState, action: AuthenticationActionTypes) : AuthenticationState {
  switch (action.type) {
    case SET_AUTH_TOKENS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case SET_USER_DATA: 
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      }
    default:
      return state;
  }
}