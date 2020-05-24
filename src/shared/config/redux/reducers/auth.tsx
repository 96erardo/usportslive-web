import { 
  AuthenticationState,
  AuthenticationActionTypes,
  SET_AUTH_TOKENS,
  SET_USER_DATA,
  LOGOUT_USER,
} from '../../../../modules/auth/auth-action-types';
import { Reducer } from 'redux';

const auth = JSON.parse(localStorage.getItem('auth') as string);

const initialState : AuthenticationState = auth ? (
  {
    ...auth, 
    user: null
  }
) : (
  {
    user: null,
    isLoggedIn: false,
    accessToken: '',
    refreshToken: '',
  }
);

/**
 * Authentication reducer
 * 
 * @param {State} state - The previous state of this reducer
 * @param {object} action - The action to execute
 * 
 * @returns {AuthenticationState} Next reducer state
 */
const reducer: Reducer<AuthenticationState, AuthenticationActionTypes> =  (state = initialState, action) => {
  let nextState: AuthenticationState = state;
  switch (action.type) {
    case SET_AUTH_TOKENS:
      nextState = {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      }; break;
    case SET_USER_DATA:
      nextState = {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      }; break;
    case LOGOUT_USER:
      nextState = {
        ...state,
        isLoggedIn: false,
        accessToken: '',
        refreshToken: '',
        user: null
      }; break;
    default:
      nextState = state;
  }
    
  localStorage.setItem('auth', JSON.stringify({
    accessToken: nextState.accessToken,
    refreshToken: nextState.refreshToken,
    isLoggedIn: nextState.isLoggedIn,
  }));
  
  return nextState;
}

export default reducer;