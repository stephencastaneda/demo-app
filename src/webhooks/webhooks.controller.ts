import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) { }

  @Get('/facebook')
  facebookGet(@Query('hub.challenge') challenge: number): number {
    console.log('challenge', challenge)
    return challenge
  }

  @Post('/facebook')
  facebookPost(@Body() body): string {
    console.log('body', JSON.stringify(body))
    return body
  }
}
