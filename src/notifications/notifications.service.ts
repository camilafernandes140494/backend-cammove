import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import admin from 'src/firebase/firebase.config';
import { NotificationsDataTypes } from './notifications.types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
    private firestore = admin.firestore();

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

    async sendPushNotificationType(id: string, body: NotificationsDataTypes, ) {

    try {
      const notificationsCollectionRef = this.firestore
        .collection('notifications')
        .doc(id)
        .collection('notificationsData');

      const newSchedulesRef = notificationsCollectionRef.doc();

      await newSchedulesRef.set(body);

      return {
        message: 'Notificação cadastrada com sucesso',
        id: newSchedulesRef.id,
      };

    } catch (error) {
      this.logger.error(`Error sending push notification: ${error.message}`, error.stack);
      throw error;
    }
  }

    async getNotifications(id: string) {
    try {
      const snapshot = await this.firestore
        .collection('notifications')
        .doc(id)
        .collection('notificationsData')
        .get();

      if (snapshot.empty) {
        return {
          message: 'Nenhuma notificação encontrada.',
        };
      }
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return notifications;
    } catch (error) {
      throw new Error('Erro ao buscar agendamentos: ' + error.message);
    }
  }

}

