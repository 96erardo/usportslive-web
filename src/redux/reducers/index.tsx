import app from './app';
import auth from './auth';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  auth,
  app
});

export type RootState = ReturnType<typeof rootReducer>;