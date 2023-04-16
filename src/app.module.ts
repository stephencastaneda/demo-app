import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhooksController } from './webhooks/webhooks.controller'
import { WebhooksService } from './webhooks/webhooks.service'


@Module({
  imports: [],
  controllers: [AppController, WebhooksController],
  providers: [AppService, WebhooksService],
})
export class AppModule { }
