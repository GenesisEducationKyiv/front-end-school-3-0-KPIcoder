type onValueCallback<T> = (val: NonNullable<T>) => void
type onNothingCallback = () => void

export class Maybe<T> {
    private just?: NonNullable<T>

    constructor(val: T) {
        if(val) this.just = val
    }

    // using callbacks to imitate pattern matching
    // e.g in haskell
    // case maybeValue of
    //   Just value -> ...
    //   Nothing    -> ...
    unwrap(onValue: onValueCallback<T>, onNothing: onNothingCallback): void {
        return this.just ? onValue(this.just) : onNothing()
    }

    getWithDefault(defaultValue: T): T {
        return this.just ?? defaultValue
    }
}