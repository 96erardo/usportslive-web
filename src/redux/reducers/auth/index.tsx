import { 
  Authentication,
  AuthenticationActionTypes,
  AUTH_LOGIN,
} from '../../actions/auth/types';

const initialState : Authentication = {
  isLoggedIn: false,
  user: null,
  accessToken: '',
  refreshToken: '',
}

/**
 * Authentication reducer
 * 
 * @param {State} state - The previous state of this reducer
 * @param {object} action - The action to execute
 * 
 * @returns {Authentication} Next reducer state
 */
export default function (state: Authentication = initialState, action: AuthenticationActionTypes) : Authentication {
  switch (action.type) {
    case AUTH_LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    default:
      return state;
  }
}