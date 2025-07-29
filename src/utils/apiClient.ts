import { request, test as base } from '@playwright/test';

export async function createApiClient(baseURL: string) {
  const context = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      'api_key': process.env.API_KEY || ''
    }
  });
  return context;
}