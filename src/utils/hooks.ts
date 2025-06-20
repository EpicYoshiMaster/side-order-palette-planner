import { useCallback, useEffect, useState } from "react";
import { useSearchParams, NavigateOptions } from "react-router-dom";
import { convertShareCode, generateShareCode } from "./utils";

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

export const usePlacedChips = (key: string, defaultValue: number[], navigateOpts: NavigateOptions, onParseValue: (parsedValue: number[]) => void): [number[], (newValue: number[]) => void] => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [value, setValue] = useState<number[]>(() => {
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
		if(searchParams.has(key)) {
			const valueShareCode = generateShareCode(value);

			const paramShareCode = searchParams.get(key);

			if(paramShareCode && valueShareCode !== paramShareCode) {

				const paramValue = convertShareCode(paramShareCode);

				setValue(paramValue);

				localStorage.setItem(key, JSON.stringify(paramValue));

				onParseValue && onParseValue(paramValue);
			}
		}
	}, [key, value, searchParams, onParseValue]);

	const updateValue = useCallback((newValue: number[]) => {
		setSearchParams((prevParams) => {
			prevParams.set(key, generateShareCode(newValue));

			return prevParams;
		}, navigateOpts);

		localStorage.setItem(key, JSON.stringify(newValue));

		setValue(newValue);
	}, [key, setValue, setSearchParams, navigateOpts]);

	return [value, updateValue];
}