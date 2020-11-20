import { useAppStore } from '../app/app-store';
import { authenticated } from '../../shared/config/axios';
import { Image, MutationResult } from '../../shared/types';
import { AxiosResponse } from 'axios';
import Logger from 'js-logger';

/**
 * Uploads the image file
 * 
 * @param {UploadImageInput} data - The data needed to upload the image
 * 
 * @returns {Promise<MutationResult<Image>>} The request result
 */
export async function uploadImage (data: UploadImageInput): Promise<MutationResult<Image>> {
  const { accessToken } = useAppStore.getState();
  const form = new FormData();

  form.append('img', data.img);
  form.append('crop', data.crop ? 'true' : 'false');
  form.append('x', data.x.toString());
  form.append('y', data.y.toString());
  form.append('width', data.width.toString());
  form.append('height', data.height.toString());

  try {
    const res: AxiosResponse<Image> = await authenticated.post(`/api/files/image`, form, {
      headers: {
        'Content-Type': 'multipart-form-data',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    Logger.info('uploadImage', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('uploadImage', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

type UploadImageInput = {
  img: File,
  crop: boolean,
  x: number,
  y: number,
  width: number,
  height: number,
}