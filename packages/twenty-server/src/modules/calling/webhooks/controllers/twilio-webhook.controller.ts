import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { TwilioWebhookService } from 'src/modules/calling/twilio-provider/services/twilio-webhook.service';
import { WebhookHandlerService } from 'src/modules/calling/webhooks/services/webhook-handler.service';

@Controller('webhooks/twilio')
export class TwilioWebhookController {
  constructor(
    private readonly twilioWebhookService: TwilioWebhookService,
    private readonly webhookHandlerService: WebhookHandlerService,
  ) {}

  @Post('voice')
  async handleVoiceWebhook(@Body() body: any, @Res() res: Response) {
    const twiml = this.twilioWebhookService.generateTwiML();
    res.type('text/xml');
    res.send(twiml);
  }

  @Post('status')
  async handleStatusWebhook(
    @Body() body: any,
    @Headers('x-twilio-signature') signature: string,
    @Req() req: Request,
  ) {
    const isValid = this.twilioWebhookService.validateWebhookSignature(
      signature,
      req.url,
      body,
    );

    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    const webhookData = this.twilioWebhookService.parseWebhookPayload(body);
    await this.webhookHandlerService.handleCallStatusUpdate(webhookData);

    return { status: 'ok' };
  }

  @Post('recording')
  async handleRecordingWebhook(
    @Body() body: any,
    @Headers('x-twilio-signature') signature: string,
    @Req() req: Request,
  ) {
    const isValid = this.twilioWebhookService.validateWebhookSignature(
      signature,
      req.url,
      body,
    );

    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    const webhookData = this.twilioWebhookService.parseWebhookPayload(body);
    await this.webhookHandlerService.handleRecordingAvailable(webhookData);

    return { status: 'ok' };
  }
}
