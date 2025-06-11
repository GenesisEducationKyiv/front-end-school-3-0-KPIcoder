type TResult<T, E> =
    {ok: true, value: T} |
    {ok: false, error: E};

type ErrorCallback<E> = (error: E) => void;

type ValueCallback<T> = (value: T) => void;

export class Result<T, E> {

    private value?: T;
    private error?: E;

    constructor(value: T, error?: E) {
        if(value === undefined || value === null || (typeof value === "number" && isNaN(value))) {
            this.error = error ?? new Error(`The value is either 'undefined', 'null' or 'NaN'`) as E;
        } else this.value = value;
    }

    static setValue<T, E> (value: T) {
        return new Result<T, E>(value)
    }

    static setError<T, E> (error: E) {
        return new Result<T, E>(undefined as T, error)
    }

    getResultObject(): TResult<T, E> {
        return this.error
            ? { ok: false, error: this.error }
            : { ok: true, value: this.value as T };
    }

    getValueOrError(errCb: ErrorCallback<E>, valCb: ValueCallback<T>) {
        return this.error ? errCb(this.error) : valCb(this.value as T)
    }
}