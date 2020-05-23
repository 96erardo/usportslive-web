import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

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