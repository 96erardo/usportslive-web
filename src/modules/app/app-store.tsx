import create from 'zustand';
import { Sport, Role } from '../../shared/types';
import { useAuthStore } from '../auth/auth-store';
import { fetchCredentials } from './app-actions';
import { fetchSports } from '../sport/sport-actions';
import { fetchRoles } from '../user/user-actions';

export const useAppStore = create<Store>(set => ({
  accessToken: '',
  loading: true,
  sports: [],
  roles: [],
  error: null,
  /**
   * Fetches app initial data so this can
   * work correctly
   */
  fetchAppResources: async () => {
    const [err1,, auth] = await fetchCredentials();

    set({ accessToken: auth ? auth.accessToken : '' });

    const { fetchAuthenticatedUser } = useAuthStore.getState();
    
    await fetchAuthenticatedUser();
    const [err2,, sports]  = await fetchSports();
    const [err3, roles] = await fetchRoles();

    if (err1 || err2 || err3) {
      return set({
        loading: false,
        error: err1 || err2 || err3
      });
    }

    return set({
      loading: false,
      error: null,
      sports: sports ? sports.items : [],
      roles: roles.items,
    });
  },
  setClientToken: (state: string) => set({ accessToken: state }),
  setAppLoading: (state: boolean) => set({ loading: state }),
  setSports: (state: Array<Sport>) => set({ sports: state }),
  setRoles: (state: Array<Role>) => set({ roles: state })
}))

type Store = {
  accessToken: string,
  loading: boolean,
  sports: Array<Sport>,
  roles: Array<Role>,
  error: Error | null,
  fetchAppResources: () => Promise<void>,
  setAppLoading: (value: boolean) => void,
  setClientToken: (accessToken: string) => void,
  setSports: (state: Array<Sport>) => void,
  setRoles: (state: Array<Role>) => void,
}