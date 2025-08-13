import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  async sendNotification(
    @Body() body: { token: string; title: string; message: string },
  ) {
    const { token, title, message } = body;

    return this.notificationsService.sendPushNotification(token, title, message);
  }
}
