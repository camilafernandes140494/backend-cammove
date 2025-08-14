import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendPushNotification(expoPushToken: string[], title: string, body: string, data?: any) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const responseData = await response.json();
      this.logger.log(`Expo push response: ${JSON.stringify(responseData)}`);

      return responseData;
    } catch (error) {
      this.logger.error(`Error sending push notification: ${error.message}`, error.stack);
      throw error;
    }
  }
}
