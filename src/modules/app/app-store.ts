import create from 'zustand';
import { Sport, Role, Configuration } from '../../shared/types';
import { useAuthStore } from '../auth/auth-store';
import { fetchCredentials, fetchConfiguration } from './app-actions';
import { fetchSports } from '../sport/sport-actions';
import { fetchRoles } from '../user/user-actions';

export const useAppStore = create<Store>(set => ({
  accessToken: '',
  loading: true,
  sports: [],
  roles: [],
  settings: {},
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
    const [err2,, config] = await fetchConfiguration();
    const [err3,, sports]  = await fetchSports(1, ['icon']);
    const [err4, roles] = await fetchRoles();

    if (err1 || err2 || err3 || err4) {
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
      settings: config ? config.items.reduce((prev, config) => ({...prev, [config.name]: config }), {}) : {},
    });
  },
  setClientToken: (state: string) => set({ accessToken: state }),
  setAppLoading: (state: boolean) => set({ loading: state }),
  setSports: (state: Array<Sport>) => set({ sports: state }),
  setRoles: (state: Array<Role>) => set({ roles: state }),
  setSetting: (name: string, value: Configuration) => set(prevState => ({
    settings: {...prevState.settings, [name]: value }
  }))
}))

type Store = {
  accessToken: string,
  loading: boolean,
  sports: Array<Sport>,
  roles: Array<Role>,
  error: Error | null,
  settings: {
    [key: string]: Configuration
  },
  fetchAppResources: () => Promise<void>,
  setAppLoading: (value: boolean) => void,
  setClientToken: (accessToken: string) => void,
  setSports: (state: Array<Sport>) => void,
  setRoles: (state: Array<Role>) => void,
  setSetting: (name: string, value: Configuration) => void
}