import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from './config/redux/reducers';

export type AppDispatch = ThunkDispatch<RootState, undefined, Action>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type EventStore = 'sport';

export type EventResult = 'success' | 'error';

export interface PaginatedListState<T> {
  items: Array<T>,
  count: number,
  refresh(): void,
  loading: boolean,
  error: Error | null,
  last: boolean
}

export interface ModalState {
  isOpen: boolean,
  title: string,
  maxWidth: Size,
  props: object,
  component?: React.ComponentType
}

export interface ObjectRef<T> {
  id: T | null
}

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
  role: Role,
  createdAt: string,
}

export interface Sport {
  id: number,
  name: string,
  team: ObjectRef<number> | null,
  createdAt?: string
}

export type Size = 'xs' | 'sm' | 'md' | 'lg';