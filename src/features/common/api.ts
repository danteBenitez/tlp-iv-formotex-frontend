import { debounce } from '@/lib/utils';
import axios, { Axios, AxiosError, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';


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

type RequestOptions = AxiosRequestConfig

type ApiResponse<T> = {
    status: number,
    statusCode: number,
    data: T
}
export class ApiAdapter {
    private client: Axios

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL as string,
        });
        this.registerInterceptors();
    }


    registerInterceptors() {
        this.client.interceptors.request.use(
            req => req,
            err => err
        );

        this.client.interceptors.response.use(
            res => res,
            err => {
                if (err.request && (!err.response || err.response?.status === 500)) {
                    onError();
                    return Promise.reject(new ApiError(err));
                }
                throw new ApiError(err);
            }
        );
    }

    get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.client.get(url, options);
    }

    post<T>(url: string, data?: object, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.client.post(url, data, options);
    }

    patch<T>(url: string, data?: object, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.client.patch(url, data, options);
    }

    delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.client.delete(url, options);
    }

    setDefaultHeader(header: string, value: string) {
        // @ts-expect-error This assignment seems wrong but it actually succeeds
        this.client.defaults.headers[header] = value;
    }

    deleteDefaultHeader(header: string) {
        // @ts-expect-error Same as above, doesn't really matter if the header existis or not
        delete this.client.defaults.headers[header];
    }
}

// Globally notify about network errors

// Keep the notifications limited
// even when multiple requests fail
const onError = debounce(() => {
    toast.error("Ha ocurrido un error de red. Verifique su conexión a Internet");
}, 1000);


export const api = new ApiAdapter();
