import { Context } from 'koa';

export enum HttpResponseStatus {
  SUCCESS = 'SUCCESS',
  PARTIAL = 'PARTIAL',
  FAIL = 'FAIL',
}

export enum HttpMessageSeverity {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export type SuccessHttpStatus = 200 | 201 | 204;
export type ErrorHttpStatus = 400 | 401 | 404 | 503;

export interface HttpResponseMessage {
  severity: HttpMessageSeverity;
  type: string;
  message: string;
  field?: string;
}

export interface HttpResponseBody<T> {
  status: HttpResponseStatus;
  messages: HttpResponseMessage[];
  data?: T;
}

export interface ErrorResponseMessage {
  type: string;
  message: string;
  field?: string;
}

function createSuccessResponse<T>(ctx: Context) {
  return (status: SuccessHttpStatus | number, data?: T) => {
    ctx.response.status = status;
    ctx.response.body = createSuccessBody(data);
  };
}

function createSuccessBody<T>(data?: T): HttpResponseBody<T> {
  return { status: HttpResponseStatus.SUCCESS, messages: [], data };
}

function createErrorResponse(ctx: Context) {
  return (status: ErrorHttpStatus | number, ...messages: ErrorResponseMessage[]) => {
    ctx.response.status = status;
    ctx.response.body = createErrorBody(...messages);
  };
}

function createErrorBody<T = void>(...messages: ErrorResponseMessage[]): HttpResponseBody<T> {
  return {
    status: HttpResponseStatus.FAIL,
    messages: messages.map((el) => ({ ...el, severity: HttpMessageSeverity.ERROR })),
  };
}

function httpResponse(ctx: Context) {
  return {
    createSuccessResponse: createSuccessResponse(ctx),
    createErrorResponse: createErrorResponse(ctx),
  };
}

export default httpResponse;
