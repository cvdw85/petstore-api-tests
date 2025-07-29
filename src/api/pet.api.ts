import { APIRequestContext, APIResponse } from '@playwright/test';

export class PetApi {
  constructor(
    private request: APIRequestContext,
    private baseURL: string
  ) {}

  async addPet(pet: any): Promise<APIResponse> {
    const url = `${this.baseURL}/pet`;
    console.log('Calling URL:', url);

    return await this.request.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: pet
    });
  }

  async getPetById(petId: number): Promise<APIResponse> {
    const url = `${this.baseURL}/pet/${petId}`;
    console.log('Calling URL:', url);

    return await this.request.get(url, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async updatePet(pet: any): Promise<APIResponse> {
    const url = `${this.baseURL}/pet`;
    console.log('Calling URL:', url);

    return await this.request.put(url, {
      headers: { 'Content-Type': 'application/json' },
      data: pet
    });
  }
}
