import {useEffect, useState, useCallback} from 'react';

export class PromiseLoading {}

export function isLoading(value) {
    return value instanceof PromiseLoading;
}

export function isError(value) {
    return value instanceof Error;
}

const loading = new PromiseLoading();

export function useAsyncMemo(fn, deps = []) {
    const [result, setResult] = useState(loading);

    useEffect(() => {
        let active = true;

        setResult(loading);

        Promise.resolve()
            .then(fn)
            .then(
                value => {
                    if (active) setResult(value);
                },
                error => {
                    if (active) setResult(error);
                }
            );

        return () => {
            active = false;
        };
    }, deps);

    return result;
}

export function useAsyncState(fn, deps = []) {
    const [state,setState] = useState(loading);

    useEffect(() => {
        let active = true;

        setState(loading);

        Promise.resolve()
            .then(fn)
            .then(
                value => {
                    if (active) setState(value);
                },
                error => {
                    if (active) setState(error);
                }
            );

        return () => {
            active = false;
        };
    }, deps);

    return [state,setState];
}

export function useRefresh() {
    const [version, setVersion] = useState(0);

    return useCallback(() => {
        setVersion(v => v + 1);
    }, [version]);
}
