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

export interface PaginatedResponse<T> {
  count: number,
  items: Array<T>
};

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
  color: string,
  team?: Team,
  createdAt?: string
}

export interface Team {
  id: number,
  name: string,
  sportId: number,
}

export type Size = 'xs' | 'sm' | 'md' | 'lg';