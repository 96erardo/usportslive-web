import { 
  AuthenticationState,
  AuthenticationActionTypes,
  SET_AUTH_TOKENS,
  SET_USER_DATA,
} from '../../actions/auth/types';
import { Reducer } from 'redux';

const auth = JSON.parse(localStorage.getItem('auth') as string);

const initialState : AuthenticationState = auth ? (
  {
    ...auth, 
    isLoggedIn: false, 
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
    default:
      nextState = state;
  }
  
  const { user, isLoggedIn, ...rest} = state;
  
  localStorage.setItem('auth', JSON.stringify(rest));
  
  return nextState;
}

export default reducer;