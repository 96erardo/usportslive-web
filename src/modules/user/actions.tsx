import { request } from '../../shared/config/axios';
import store from '../../shared/config/redux';
import { RootState } from '../../shared/config/redux/reducers';

export async function logout () {
  const { auth }: RootState = store.getState();

  const response = await request.post('/oauth/logout', { refreshToken: auth.refreshToken }, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`
    }
  });

  console.log('response', response);

  return response;
}