import { APIRequestContext, APIResponse } from '@playwright/test';
import * as dotenv from 'dotenv';

export class PetApiClient {
  private apiPetURL: string;
  private headers: Record<string, string>;

  constructor(private request: APIRequestContext, private baseURL: string) {
    const apiKey = getApiKey();
    this.apiPetURL = `${this.baseURL}/pet`;
    this.headers = {
      'Content-Type': 'application/json',
      'api_key': apiKey
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

function getApiKey(): string {
  dotenv.config();
  const apiKey = process.env.API_KEY;
  
  try {
    expect(apiKey, 'API_KEY environment variable').toBeDefined();
    console.log('✅ API Key successfully loaded');
    return apiKey as string;
  } catch (error) {
    console.error('❌ Error: API_KEY environment variable is missing!');
    console.error('Please set the API_KEY in your .env file or environment configuration.');
    console.error('For example: API_KEY=your-api-key-here');
    process.exit(1); // or throw an error instead
  }
}

function expect<T>(value: T, name: string) {
  return {
    toBeDefined: () => {
      if (!value) {
        throw new Error(`${name} is not defined`);
      }
    }
  };
}