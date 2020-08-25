import create from 'zustand';
import { fetchUser } from '../user/user-actions';
import { exchageCodeForToken } from './auth-actions';

export const useAuthStore = create((set, get) => {
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
      const [err, data] = await fetchUser();

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
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
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
})