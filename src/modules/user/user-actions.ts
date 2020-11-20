import { request, authenticated } from '../../shared/config/axios';
import { User, PaginatedResponse, QueryResult, Role, MutationResult, ExchangeCode, Person, Image } from '../../shared/types';
import axios, { CancelTokenSource, AxiosResponse } from 'axios';
import Logger from 'js-logger';
import { useAppStore } from '../app/app-store';
import { useAuthStore } from '../auth/auth-store';
import qs from 'qs';

/**
 * Fetches the users list
 * 
 * @param {number} page - The page to fetch the items from
 * @param {Array<string>} include - The relations to include in each user
 * @param {object} data - The data to create the filters from
 * @param {CancelTokenSource} source - The cancel token to cancel de request if needed
 * 
 * @return {Promise<QueryResult<PaginatedResponse<Team>>>} The list of teams
 */
export async function fetchUsers (
  page: number = 1,
  include: Array<string> = [],
  data: FilterData = {},
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<User>>> {
  const first = 10;
  const skip = first * (page - 1);
  const filters = createFilter(data);
  const { accessToken } = useAppStore.getState();
  const query = qs.stringify({ first, skip, include, filters }, { encode: false, arrayFormat: 'brackets' })

  try {
    const res: AxiosResponse<PaginatedResponse<User>> = await request.get(`/api/users?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchUsers', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchUsers(Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchUsers', e);

    return [e];
  }
}

function createFilter (data: FilterData) {
  return {
    ...(data.q ? {
      person: { 
        name: { like: data.q }
      }
    } : {})
  };
}

export type FilterData = {
  q?: string,
}

/**
 * Fetches the specified user
 * 
 * @param {number} id - The id of the user to fetch
 * @param {Array<string>} include - Relations to include in the request
 * 
 * @returns {User} The fetched user
 */
export async function fetchUser (id: number = 0, include: Array<string> = []) {
  const { accessToken: userAccessToken } = useAuthStore.getState();
  const { accessToken: clientAccessToken } = useAppStore.getState();

  if (id === 0) {

    try {
      const response: AxiosResponse<{ user: User}> = await authenticated.get(`/api/users/${id}`, {
        params: { include },
        headers: { Authorization: `Bearer ${userAccessToken || clientAccessToken}` }
      });

      Logger.info('fetchUser', response.data);

      return [null, response.data];

    } catch (e) {
      Logger.error('fetchUser', e);
      
      return [e];
    }
  }
  

  try {
    const response: AxiosResponse<{ user: User }> = await request.get(`/api/users/${id}`, { 
      params: { include },
      headers: { Authorization: `Bearer ${clientAccessToken}` },
    });

    Logger.info('fetchUser', response.data);

    return [null, response.data];
  } catch (e) {
    Logger.error('fetchUser', e);

    return [e];
  }
}

/**
 * Fetches a list of roles
 * 
 * @param {number} page - The page that is going to be fetched
 * 
 * @returns {Promise} The request result
 */
export async function fetchRoles (page: number = 1) {
  const { accessToken } = useAppStore.getState();

  try {
    const response: AxiosResponse<PaginatedResponse<Role>> = await request.get(`/api/roles`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    Logger.info('fetchRoles', response.data);

    return [null, response.data];

  } catch (e) {
    Logger.error('fetchRoles', e);

    return [e];
  }
}

/**
 * Updates the specified user role
 * 
 * @param {number} user - The user id
 * @param {number} role - The role id
 * 
 * @returns {Promise<MutationResult<User>>} The request result
 */
export async function updateUserRole (user: number, role: number): Promise<MutationResult<User>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<User> = await authenticated.patch(`/api/users/${user}`, {
      roleId: role,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updateUserRole', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('updateUserRole', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * Registers user in platform
 * 
 * @param {SignupData} data - The data needed to signup a user
 * 
 * @return {Promise<MutationResult<User>>} - The request result
 */
export async function signup (data: SignupData): Promise<MutationResult<User>> {
  const { accessToken } = useAppStore.getState();

  const user = {
    ...data,
    avatarId: data.avatar
  }

  try {
    const res: AxiosResponse<User> = await request.post(`/api/users`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('signup', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('signup', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

type SignupData = {
  name: string,
  lastname: string,
  gender: string,
  username: string,
  email: string,
  avatar: number | null,
  password: string,
  passwordConfirmation: string,
}

/**
 * Creates an exchange code for a profile
 * 
 * @param {number} person - The person id
 * 
 * @returns {Promise<MutationResult<ExchangeCode>>} The request result
 */
export async function createExchangeCode (
  person: number
): Promise<MutationResult<ExchangeCode>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<ExchangeCode> = await authenticated.post(`/api/persons/${person}/code`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });

    Logger.info('createExchangeCode', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('createExchangeCode', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * Fetches the profile binded with the exchange code
 * 
 * @param {string} code - The exchange code
 * @param {CancelTokenSource} source - The cancel token source
 * 
 * @returns {Promise<QueryResult<Person>>} The request result
 */
export async function fetchExchangeCodeProfile (
  code: string,
  source?: CancelTokenSource
): Promise<QueryResult<Person>> {
  const { accessToken } = useAppStore.getState();

  try {
    const res: AxiosResponse<Person> = await authenticated.get(`/api/persons/code/${code}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchExchangeCodeProfile', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (e.response) {
      Logger.error('fetchExchangeCodeProfile', e);

      return [e.response.data]    
    }

    if (axios.isCancel(e)) {
      Logger.error('fetchExchangeCodeProfile(Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchExchangeCodeProfile', e);

    return [e];
  }
}

/**
 * Bind user data to an already created profile
 * 
 * @param {BindUserData} data - Data needed to bid the user to the profile
 * 
 * @returns {Promise<MutationResult<User>>} The request result
 */
export async function bindUserToProfile (data: BindUserData): Promise<MutationResult<User>> {
  const { accessToken } = useAppStore.getState();
  const { code, ...user } = data;

  try {
    const res: AxiosResponse<User> = await request.post(`/api/users/bind/${code}`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('bindUserToProfile', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('bindUserToProfile', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

export type BindUserData = {
  email: string,
  username: string,
  password: string,
  passwordConfirmation: string,
  code: string,
}

/**
 * Updates a user profile
 * 
 * @param {UpdateUserData} data - The data to update the user
 * 
 * @returns {Promise<MutationResult<User>>} The request result
 */
export async function updateUser (data: UpdateUserData): Promise<MutationResult<User>> {
  const { accessToken } = useAuthStore.getState();
  const { id, ...user } = data;

  try {
    const res: AxiosResponse<User> = await authenticated.patch(`/api/users/${id}`, {
      username: user.username,
      email: user.email,
      ...(user.oldPassword ? { oldPassword: user.oldPassword } : {}),
      ...(user.password ? { password: user.password } : {}),
      ...(user.passwordConfirmation ? { passwordConfirmation: user.passwordConfirmation } : {}),
      person: {
        name: user.name,
        lastname: user.lastname,
        gender: user.gender,
        ...(user.avatar ? { avatarId: user.avatar.id } : {})
      }
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updateUser', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('updateUser', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

type UpdateUserData = {
  id: number,
  username: string,
  email: string,
  password: string,
  oldPassword: string,
  passwordConfirmation: string,
  name: string,
  lastname: string,
  gender: string,
  avatar?: Image | null
}