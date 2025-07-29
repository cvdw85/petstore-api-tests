import { test, expect, request } from '@playwright/test';
import { PetApi } from '../api/pet.api';

interface Pet {
  id: number;
  name: string;
  status: string;
}

const PET_DATA = {
  initial: {
    id: 0,
    name: 'Fluffy',
    status: 'available'
  },
  updated: {
    id: 0,
    name: 'FluffyUpdated',
    status: 'sold'
  }
};

const RETRY_CONFIG = {
  maxRetries: 120,
  retryDelayMs: 1000
};

test.describe('Petstore API Tests', () => {
  let petApi: PetApi;
  const baseURL = process.env.BASE_URL || 'https://petstore.swagger.io/v2';
  const petId = Date.now();

  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    petApi = new PetApi(apiContext, baseURL);
  });

  async function waitForPet(petId: number): Promise<import('@playwright/test').APIResponse> {
    for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      const response = await petApi.getPetById(petId);
      if (response.status() === 200) {
        return response;
      }
      console.warn(`Pet ${petId} not found (attempt ${attempt}/${RETRY_CONFIG.maxRetries})... retrying in ${RETRY_CONFIG.retryDelayMs}ms`);
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.retryDelayMs));
    }
    throw new Error(`Pet ${petId} not found after ${RETRY_CONFIG.maxRetries} attempts`);
  }

  test('Add new pet (POST /pet)', async () => {
    const newPet: Pet = { ...PET_DATA.initial, id: petId };
    const response = await petApi.addPet(newPet);

    console.log(`POST /pet status: ${response.status()}`);
    console.log(`POST /pet body: ${await response.text()}`);

    expect(response.status(), 'Expected POST /pet to return 200 OK').toBe(200);
    const body = await response.json();
    expect(body, 'Expected response body to match the created pet').toMatchObject({
      id: petId,
      name: 'Fluffy',
      status: 'available'
    });
  });

  test('Get pet by ID (GET /pet/{petId})', async () => {
    const response = await waitForPet(petId);

    console.log(`GET /pet/${petId} status: ${response.status()}`);
    console.log(`GET /pet/${petId} body: ${await response.text()}`);

    expect(response.status(), 'Expected GET /pet/{petId} to return 200 OK').toBe(200);
    const body = await response.json();
    expect(body, 'Expected response body to match the pet').toMatchObject({
      id: petId,
      name: 'Fluffy',
      status: 'available'
    });
  });

  test('Update existing pet (PUT /pet)', async () => {
    const updatedPet: Pet = { ...PET_DATA.updated, id: petId };
    const response = await petApi.updatePet(updatedPet);

    console.log(`PUT /pet status: ${response.status()}`);
    console.log(`PUT /pet body: ${await response.text()}`);

    expect(response.status(), 'Expected PUT /pet to return 200 OK').toBe(200);
    const body = await response.json();
    expect(body, 'Expected response body to match the updated pet').toMatchObject({
      id: petId,
      name: 'FluffyUpdated',
      status: 'sold'
    });
  });
});