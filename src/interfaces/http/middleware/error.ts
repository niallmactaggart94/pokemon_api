import { Context, Next } from 'koa';
import httpResponse from '../httpResponse';
import { HttpErrorType } from '../HttpErrorType';

export const error = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (e) {
    if (ctx.invalid) {
      handleValidationErrors(ctx, e);
    } else {
      const error = e as any;
      console.error({ error });
      const status = error.status ? error.status : 500;
      httpResponse(ctx).createErrorResponse(status, {
        type: 'UNKNOWN',
        message: error.message ? error.message : 'Unknown error!',
      });
    }
  }
};

function handleValidationErrors(ctx: Context, error: any) {
  if (ctx.invalid.params) {
    handleParamsValidation(ctx, error);
  } else if (ctx.invalid.body) {
    handleBodyValidation(ctx, error);
  } else {
    handleUnknownValidation(ctx, error);
  }
}

function handleBodyValidation(ctx: Context, error: any) {
  const errors: any[] = ctx.invalid.body.details;
  httpResponse(ctx).createErrorResponse(
    error.status,
    ...errors.map((el) => ({ type: HttpErrorType.RequestFormatError, message: el.message, field: el.context.key }))
  );
}

function handleParamsValidation(ctx: Context, error: any) {
  const errors: any[] = ctx.invalid.params.details;
  httpResponse(ctx).createErrorResponse(
    error.status,
    ...errors.map((el) => ({ type: HttpErrorType.ParamsFormatError, message: el.message, field: el.context.key }))
  );
}

function handleUnknownValidation(ctx: Context, error: any) {
  httpResponse(ctx).createErrorResponse(error.status, {
    type: HttpErrorType.UnknownValidationError,
    message: 'Unknown validation error!',
  });
}
