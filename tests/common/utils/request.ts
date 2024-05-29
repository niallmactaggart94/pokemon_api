import { Response, SuperAgentRequest } from 'superagent';
import { requestUtil } from '../setup/initHttpEnv';

export type UrlElement = number | string;
async function getRequest(url: string): Promise<Response> {
  const request = requestUtil.get(url).send();
  return makeRequest(request);
}

async function putRequest(url: string): Promise<Response> {
  const request = requestUtil.put(url);
  return makeRequest(request);
}

async function makeRequest(request: SuperAgentRequest): Promise<Response> {
  return request.send();
}

export default {
  get: getRequest,
  put: putRequest,
};
