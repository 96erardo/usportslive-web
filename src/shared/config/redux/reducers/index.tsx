import app from './app';
import auth from './auth';
import sport from './sport';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  auth,
  app,
  sport
});

export type RootState = ReturnType<typeof rootReducer>;