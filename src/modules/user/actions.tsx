import { request } from '../../config/axios';
import store from '../../redux';
import { RootState } from '../../redux/reducers';

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