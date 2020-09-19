import { request } from '../../shared/config/axios';
import qs from 'qs';
import Logger from 'js-logger';

/**
 * Exchanges the authorization code with access and refresh token 
 * with oauth server
 * 
 * @param code - Authorization code received from oauth server
 * @param grantType - Grant type used to authenticate
 * @param state - State received by oauth server
 * @param redirectUri - The url to redirect after successful login
 * @param clientId - The id of this client app
 * 
 * @returns {AppThunk<Promise<void>>}
 */
export async function exchageCodeForToken (
  code: string, 
  grantType: string, 
  state: String, 
  redirectUri: string, 
  clientId: string
) {
  try {
    
    const response = await request.post('/oauth/token', qs.stringify({
      code,
      grant_type: grantType,
      state,
      redirect_uri: redirectUri,
      client_id: clientId
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    Logger.info('exchangeCodeForToken', response.data);

    return [null, response.data];
        
  } catch (e) {
    Logger.error('exchangeCodeForToken', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
};

/**
 * Logs the user out
 * 
 * @returns {Promise}
 */
export async function signout () {
  
}