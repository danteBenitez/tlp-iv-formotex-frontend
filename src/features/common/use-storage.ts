import { useEffect, useState } from "react";

type UseStoreResult =
    | {
        loading: true;
        value: string | null;
        setItem: (value: string | null) => void;
    }
    | {
        loading: false;
        value: string;
        setItem: (value: string | null) => void;
    };

export default function useLocalStorage(key: string) {
    const [value, setValue] = useState<string | null>(null);

    const getItem = () => {
        const result = localStorage.getItem(key);
        if (result === null) {
            setValue(null);
            return;
        }
        setValue(result as string);
    };

    useEffect(() => {
        getItem();
    }, [key]);

    const setItem = (value: string | null) => {
        if (value === null) {
            localStorage.removeItem(key);
            setValue(null);

            return;
        }
        localStorage.setItem(key, value);
        setValue(value);
    };

    return {
        loading: false,
        value,
        setItem,
    } as UseStoreResult;
}