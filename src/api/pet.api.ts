import { APIRequestContext, APIResponse } from '@playwright/test';

export class PetApi {
  private apiKey: string;
  private apiPetURL: string;
  private headers: Record<string, string>;

  constructor(private request: APIRequestContext, private baseURL: string) {
    this.apiKey = process.env.API_KEY || '';
    this.apiPetURL = `${this.baseURL}/pet`;
    this.headers = {
      'Content-Type': 'application/json',
      'api_key': this.apiKey
    };
  }

  async addPet(pet: any): Promise<APIResponse> {
    console.log(`Calling URL: ${this.apiPetURL}`);
    return await this.request.post(this.apiPetURL, {
      headers: this.headers,
      data: pet
    });
  }

  async getPetById(petId: number): Promise<APIResponse> {
    console.log(`Calling URL: ${this.apiPetURL}/${petId}`);
    return await this.request.get(`${this.apiPetURL}/${petId}`, {
      headers: this.headers
    });
  }

  async updatePet(pet: any): Promise<APIResponse> {
    console.log(`Calling URL: ${this.apiPetURL}`);
    return await this.request.put(this.apiPetURL, {
      headers: this.headers,
      data: pet
    });
  }
}