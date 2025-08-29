import { Injectable } from '@nestjs/common';

@Injectable()
export class TwilioClientService {
  private client: any;

  constructor() {
    try {
      const { Twilio } = require('twilio');
      
      // Validate required environment variables
      if (!process.env.TWILIO_ACCOUNT_SID) {
        throw new Error('TWILIO_ACCOUNT_SID is required');
      }
      
      if (!process.env.TWILIO_API_KEY_SID || !process.env.TWILIO_API_KEY_SECRET) {
        throw new Error('TWILIO_API_KEY_SID and TWILIO_API_KEY_SECRET are required');
      }
      
      // Use API Key authentication (secure method)
      this.client = new Twilio(
        process.env.TWILIO_API_KEY_SID,
        process.env.TWILIO_API_KEY_SECRET,
        { accountSid: process.env.TWILIO_ACCOUNT_SID }
      );
      
      console.log('Twilio client initialized with API Key authentication');
    } catch (error) {
      console.error('Failed to initialize Twilio client:', error.message);
      this.client = null;
    }
  }

  getClient(): any {
    if (!this.client) {
      throw new Error('Twilio client not initialized. Please install twilio package.');
    }
    return this.client;
  }

  async validateCredentials(): Promise<boolean> {
    if (!this.client) return false;
    try {
      const account = await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      console.log(`Twilio account validated: ${account.friendlyName}`);
      return true;
    } catch (error) {
      console.error('Twilio credential validation failed:', error.message);
      return false;
    }
  }
}
