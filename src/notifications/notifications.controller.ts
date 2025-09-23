import { Controller, Post, Body, Param, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsDataTypes } from './notifications.types';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  async sendNotification(
    @Body() body: { token: string[]; title: string; message: string },
  ) {
    const { token, title, message } = body;

    return this.notificationsService.sendPushNotification(token, title, message);
  }

     @Post(':id')
    async sendNotificationType(
      @Param('id') id: string,
       @Body() body: NotificationsDataTypes,

    ) {
      return this.notificationsService.sendPushNotificationType(id, body);
    }



    @Patch(':id/:idNotification')
    async putPushNotificationType(
      @Param('id') id: string,
      @Param('idNotification') idNotification: string,
       @Body() body: NotificationsDataTypes,

    ) {
      return this.notificationsService.putPushNotificationType(id,idNotification, body);
    }

      @Get(':id')
      @HttpCode(HttpStatus.OK)
      async getNotifications(@Param('id') id: string) {
        try {
          return await this.notificationsService.getNotifications(id);
        } catch (error) {
          console.error('Erro ao buscar usuário: ', error);
          throw error;
        }
      }
    
}

