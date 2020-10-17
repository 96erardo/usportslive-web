import create, { SetState, GetState, StoreApi, StateCreator } from 'zustand';
import { fetchUser } from '../user/user-actions';
import { exchageCodeForToken } from './auth-actions';
import { User } from '../../shared/types';

const save = (config: StateCreator<Store>) => (
  set: SetState<Store>, 
  get: GetState<Store>,
  api: StoreApi<Store>
) => config(args => {
  set(args);

  const { isLoggedIn, accessToken, refreshToken } = get();

  localStorage.setItem('auth', JSON.stringify({
    isLoggedIn,
    accessToken,
    refreshToken
  }) as string);
}, get, api);

export const useAuthStore = create<Store>(save((set: SetState<Store>, get: GetState<Store>) => {
  const auth = JSON.parse(localStorage.getItem('auth') as string);

  return {
    isLoggedIn: false,
    accessToken: '',
    refreshToken: '',
    ...auth,
    user: null,
    /**
     * Fetches the currently authenticated user
     * if it is
     */
    fetchAuthenticatedUser: async () => {
      const [err, data] = await fetchUser(0, ['role', 'person', 'person.avatar']);

      if (err || !data.user) {
        return get().logout();
      }

      return set({
        isLoggedIn: true,
        user: data.user 
      })
    },
    /**
     * Exchanges authorization code for
     * access token to keep user session alive
     */
    authenticate: async (
      code: string,
      grantType: string,
      state: String,
      redirectUri: string,
      clientId: string
    ) => {
      const [err, data] = await exchageCodeForToken(code, grantType, state, redirectUri, clientId);

      if (err) {
        return get().logout();
      }

      set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      await get().fetchAuthenticatedUser();
    },
    /**
     * Deletes the information on the authenticated user
     * (logs him out)
     */
    logout: () => set({
      isLoggedIn: false,
      accessToken: '',
      refreshToken: '',
      user: null,
    }),
    /**
     * Replaces the tokens in the store
     */
    setAuthTokens: (accessToken: string, refreshToken: string) => set({ accessToken, refreshToken }),
  }
}));

type Store = {
  isLoggedIn: boolean,
  accessToken: string,
  refreshToken: string,
  user: User | null,
  authenticate: (
    code: string,
    grantType: string,
    state: String,
    redirectUri: string,
    clientId: string
  ) => Promise<void>,
  fetchAuthenticatedUser: () => Promise<void>,
  setAuthTokens: (access: string, refresh: string) => void,
  logout: () => void,
}