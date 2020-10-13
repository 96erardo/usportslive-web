import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { RequestError } from './types';

export const onErrorMixin = (e: AxiosError) => {
  if (e.response) {
    if (e.response.status === 400) {
      if (e.response.data) {
        const { errors } = e.response.data;

        Object.keys(errors).forEach(key => {
          toast.error(errors[key].msg)
        });
      }
    }
  }
};

export function onError (e: string | Error | RequestError) {
  if (typeof e === 'string') {
    toast.error(e);
  }

  if (e instanceof Error) {
    toast.error(e.message)
  }

  e = e as RequestError;

  if (e.errors) {
    const keys = Object.keys(e.errors);

    for(let i = 0; (i < keys.length) && (i < 5); i++) {
      toast.error(e.errors[keys[i]].msg)
    }
  }

  if (e.error && e.error_description) {
    toast.error(e.error_description)
  }
}