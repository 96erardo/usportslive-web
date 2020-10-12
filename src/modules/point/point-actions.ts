import { authenticated } from '../../shared/config/axios';
import { useAuthStore } from '../auth/auth-store';
import { AxiosResponse } from 'axios';
import { MutationResult, Point } from '../../shared/types';
import Logger from 'js-logger';

/**
 * Created a point in the specified game
 * 
 * @param {CreatePointInput} data - The data needed to create a point
 * 
 * @returns {Promise<MutationResult<Point>>} The created point
 */
export async function createPoint (data: CreatePointInput): Promise<MutationResult<Point>> {
  const { accessToken } = useAuthStore.getState();
  const { gameId } = data;

  const point = {
    minute: data.minute,
    teamId: data.teamId,
    personId: data.scorerId,
    assisterId: data.assisterId,
  }

  try {
    const res: AxiosResponse<Point> = await authenticated.post(`/api/games/${gameId}/point`, point, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('createPoint', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('createPoint', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

type CreatePointInput = {
  minute: number,
  teamId: number,
  gameId: number,
  scorerId: number,
  assisterId?: number,
}

/**
 * Updates a point status
 * 
 * @param {string} id - The id of the point to update the status to
 * @param {string} status - The status to put in it
 * 
 * @returns {Promise<MutationResult<Point>>} The request result
 */
export async function updatePoint (data: UpdatePointInput): Promise<MutationResult<Point>> {
  const { accessToken } = useAuthStore.getState();
  const { id } = data;

  const point = {
    minute: data.minute,
    personId: data.scorerId,
    assisterId: data.assisterId,
    status: data.status
  };

  try {
    const res: AxiosResponse<Point> = await authenticated.patch(`/api/games/point/${id}`, point, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('updatePointStatus', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('updatePointStatus', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

type UpdatePointInput = {
  id: number,
  minute: number,
  scorerId: number,
  assisterId: number | null,
  status: 'VALID' | 'CANCELED'
}

/**
 * Deletes the specified point
 * 
 * @param {number} id - The point id
 * 
 * @returns {Promise<MutationResult<void>>} The request result
 */
export async function deletePoint (id: number): Promise<MutationResult<void>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<void> = await authenticated.delete(`/api/games/point/${id}`, {
      headers: {
        Authorization: accessToken,
      }
    });

    Logger.info('deletePoint', res.data);

    return [null];
    
  } catch (e) {
    Logger.error('updatePointStatus', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}