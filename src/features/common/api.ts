import { debounce } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
});

interface ApiErrorResponse {
    status: number,
    data: { message: string }
}
export class ApiError extends Error {
    constructor(
        private axiosError: AxiosError
    ) {
        super(axiosError.message);
    }

    get response(): ApiErrorResponse | undefined {
        return this.axiosError.response as ApiErrorResponse;
    }
}

// Globally notify about network errors

// Keep the notifications limited
// even when multiple requests fail
const onError = debounce(() => {
    toast.error("Ha ocurrido un error de red. Verifique su conexión a Internet");
}, 1000);

api.interceptors.request.use(
    req => req,
    err => err
);

api.interceptors.response.use(
    res => res,
    err => {
        if (err.request && (!err.response || err.response?.status === 500)) {
            onError();
            return Promise.reject(new ApiError(err));
        }
        throw new ApiError(err);
    }
);
