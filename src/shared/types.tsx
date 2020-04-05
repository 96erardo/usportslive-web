import { Action, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '../redux/reducers';

export type AppDispatch = ThunkDispatch<RootState, undefined, Action>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export interface Person {
  id: number,
  name: string,
  lastname: string,
  birthDate?: Date,
}

export interface Role {
  id: string,
  name: string
}

export interface User {
  id: number,
  username: string,
  email: string,
  streamKey?: string,
  person: Person,
  role: Role
}