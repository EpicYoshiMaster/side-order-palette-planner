import { useCallback, useEffect, useState } from "react";
import { useSearchParams, NavigateOptions } from "react-router-dom";

export const useKeyDown = (callback: (event: KeyboardEvent) => void) => {
	useEffect(() => {
		document.addEventListener('keydown', callback);

		return () => {
			document.removeEventListener('keydown', callback);
		}
	}, [callback]);
}

export const useSearchParamNumber = (param: string, defaultValue: number, navigateOpts?: NavigateOptions): [number, (newValue: number) => void] => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [value, setValue] = useState<number>(defaultValue);

	useEffect(() => {
		if(searchParams.has(param) && value !== Number(searchParams.get(param))) {
			setValue(Number(searchParams.get(param)));
		}
	}, [param, value, searchParams]);

	const updateValue = useCallback((newValue: number) => {
		setSearchParams((prevParams) => {
			prevParams.set(param, String(newValue));

			return prevParams;
		}, navigateOpts);
		setValue(newValue);
	}, [param, setValue, setSearchParams, navigateOpts]);

	return [value, updateValue];
}

export const useLocalStorage = <T>(key: string, defaultValue: T, onParseValue?: (parsedValue: T) => void): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(() => {
        try {
            const savedValue = localStorage.getItem(key);

            if(savedValue !== null) {
				const parsedValue = JSON.parse(savedValue);

				onParseValue && onParseValue(parsedValue);
                return parsedValue;
            }

            return defaultValue;
        }
        catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}