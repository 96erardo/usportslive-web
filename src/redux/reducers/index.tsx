import auth from './auth';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  auth,
});

export type RootState = ReturnType<typeof rootReducer>;