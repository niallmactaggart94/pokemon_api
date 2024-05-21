type ResultStatus<Value, Error = string> = { isValid: true; value: Value } | { isValid: false; error: Error };

export class Result<Value, Error = string> {
  constructor(public status: ResultStatus<Value, Error>) {}

  ifSuccess(onSuccess: (value: Value) => void) {
    if (this.status.isValid) {
      onSuccess(this.status.value);
    }

    return this;
  }

  ifError(onError: (error: Error) => void) {
    if (!this.status.isValid) {
      onError(this.status.error);
    }

    return this;
  }
}

export function createSuccessResult<Value, Error = string>(value: Value): Result<Value, Error> {
  return new Result<Value, Error>({ isValid: true, value });
}

export function createErrorResult<Value, Error = string>(error: Error): Result<Value, Error> {
  return new Result<Value, Error>({ isValid: false, error });
}
