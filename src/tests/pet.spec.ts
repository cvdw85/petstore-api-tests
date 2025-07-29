import { test, expect, request } from '@playwright/test';
import { PetApi } from '../api/pet.api';

// Interface for pet object to ensure type safety
interface Pet {
  id: number;
  name: string;
  status: string;
}

// Centralized test data
const PET_DATA = {
  initial: {
    id: 0, // Will be set dynamically
    name: 'Fluffy',
    status: 'available'
  },
  updated: {
    id: 0, // Will be set dynamically
    name: 'FluffyUpdated',
    status: 'sold'
  }
};

// Configuration for retry logic
const RETRY_CONFIG = {
  maxRetries: 120,
  retryDelayMs: 1000
};

test.describe('Petstore API Tests', () => {
  let petApi: PetApi;
  const baseURL = process.env.BASE_URL || 'https://petstore.swagger.io/v2';
  const petId = Date.now(); // Unique pet ID for test isolation

  // Initialize API context before all tests
  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    petApi = new PetApi(apiContext, baseURL);
  });

  /**
   * Helper function to wait for a pet to be available with retry logic
   * @param petId - The ID of the pet to check
   * @returns The API response when the pet is found
   * @throws Error if the pet is not found after max retries
   */
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

    // Log response details
    console.log(`POST /pet status: ${response.status()}`);
    console.log(`POST /pet body: ${await response.text()}`);

    // Assertions
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

    // Log response details
    console.log(`GET /pet/${petId} status: ${response.status()}`);
    console.log(`GET /pet/${petId} body: ${await response.text()}`);

    // Assertions
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

    // Log response details
    console.log(`PUT /pet status: ${response.status()}`);
    console.log(`PUT /pet body: ${await response.text()}`);

    // Assertions
    expect(response.status(), 'Expected PUT /pet to return 200 OK').toBe(200);
    const body = await response.json();
    expect(body, 'Expected response body to match the updated pet').toMatchObject({
      id: petId,
      name: 'FluffyUpdated',
      status: 'sold'
    });
  });
});