import { debounce } from '@/lib/utils';
import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
});


// Globally notify about network errors

// Keep the notifications limited
// even when multiple requests fail
const onError = debounce(() => {

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
            return Promise.reject(err);
        }
        throw err;
    }
);