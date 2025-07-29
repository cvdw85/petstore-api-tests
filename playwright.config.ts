import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://petstore.swagger.io/v2',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
  reporter: [['list']],
});