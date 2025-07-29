import { APIRequestContext, APIResponse } from '@playwright/test';

export class PetApi {
  private apiKey: string;

  constructor(private request: APIRequestContext, private baseURL: string) {
    this.apiKey = process.env.API_KEY || '';
  }

  async addPet(pet: any): Promise<APIResponse> {
    console.log(`Calling URL: ${this.baseURL}/pet`);
    return await this.request.post(`${this.baseURL}/pet`, {
      headers: {
        'Content-Type': 'application/json',
        'api_key': this.apiKey
      },
      data: pet
    });
  }

  async getPetById(petId: number): Promise<APIResponse> {
    console.log(`Calling URL: ${this.baseURL}/pet/${petId}`);
    return await this.request.get(`${this.baseURL}/pet/${petId}`, {
      headers: {
        'Content-Type': 'application/json',
        'api_key': this.apiKey
      }
    });
  }

  async updatePet(pet: any): Promise<APIResponse> {
    console.log(`Calling URL: ${this.baseURL}/pet`);
    return await this.request.put(`${this.baseURL}/pet`, {
      headers: {
        'Content-Type': 'application/json',
        'api_key': this.apiKey
      },
      data: pet
    });
  }
}
