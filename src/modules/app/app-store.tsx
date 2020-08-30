import create from 'zustand';
import { Sport, Role } from '../../shared/types';
import { useAuthStore } from '../auth/auth-store';
import { fetchSports } from '../sport/sport-actions';
import { fetchRoles } from '../user/user-actions';

export const useAppStore = create(set => ({
  loading: true,
  sports: [],
  roles: [],
  error: null,
  /**
   * Fetches app initial data so this can
   * work correctly
   */
  fetchAppResources: async () => {
    const { fetchAuthenticatedUser } = useAuthStore.getState();

    await fetchAuthenticatedUser();
    const [err1,, sports]  = await fetchSports();
    const [err2, roles] = await fetchRoles();

    if (err1 || err2) {
      return set({
        loading: false,
        error: err1 || err2
      });
    }

    return set({
      loading: false,
      error: null,
      sports: sports ? sports.items : [],
      roles: roles.items,
    });
  },
  setAppLoading: (state: boolean) => set({ loading: state }),
  setSports: (state: Array<Sport>) => set({ sports: state }),
  setRoles: (state: Array<Role>) => set({ roles: state })
}))