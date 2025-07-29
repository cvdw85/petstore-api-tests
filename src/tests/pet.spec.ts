import { test, expect, request } from '@playwright/test';
import { PetApi } from '../api/pet.api';

test.describe('Petstore API Tests', () => {
    let petApi: PetApi;
    const baseURL = process.env.BASE_URL || 'https://petstore.swagger.io/v2';

    // --- Test variables
    const petId = Date.now();

    test.beforeAll(async () => {
        const apiContext = await request.newContext();
        petApi = new PetApi(apiContext, baseURL);
    });

    test('Add new pet (POST /pet)', async () => {
        const newPet = {
            id: petId,
            name: 'Fluffy',
            status: 'available'
        };
        const response = await petApi.addPet(newPet);

        console.log('POST /pet status:', response.status());
        console.log('POST /pet body:', await response.text());

        expect(response.status(), 'POST should return 200').toBe(200);

        const body = await response.json();
        expect(body.id).toBe(petId);
        expect(body.name).toBe('Fluffy');
        expect(body.status).toBe('available');
    });

    test('Get pet by ID (GET /pet/{petId})', async () => {
        const waitForPet = async (retries = 120, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
                const response = await petApi.getPetById(petId);
                if (response.status() === 200) {
                    return response;
                }
                console.log(`Pet not found yet (attempt ${i + 1})... retrying`);
                await new Promise(res => setTimeout(res, delay));
            }
            throw new Error(`Pet ${petId} not found after ${retries} retries`);
        };

        const response = await waitForPet();

        console.log('GET /pet/{id} status:', response.status());
        console.log('GET /pet/{id} body:', await response.text());

        expect(response.status(), 'GET should return 200').toBe(200);

        const body = await response.json();
        expect(body.id).toBe(petId);
        expect(body.name).toBe('Fluffy');
        expect(body.status).toBe('available');

        await new Promise(res => setTimeout(res, 5000));
    });

    test('Update existing pet (PUT /pet)', async () => {
        const updatedPet = {
            id: petId,
            name: 'FluffyUpdated',
            status: 'sold'
        };
        const response = await petApi.updatePet(updatedPet);

        console.log('PUT /pet status:', response.status());
        console.log('PUT /pet body:', await response.text());

        expect(response.status(), 'PUT should return 200').toBe(200);

        const body = await response.json();
        expect(body.id).toBe(petId);
        expect(body.name).toBe('FluffyUpdated');
        expect(body.status).toBe('sold');
    });
});
