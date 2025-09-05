import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import admin from 'src/firebase/firebase.config';
import { NotificationsDataTypes } from './notifications.types';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
    private firestore = admin.firestore();
  constructor(private notificationsGateway: NotificationsGateway) {}

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

      async putPushNotificationType(id: string, idNotification: string,body: NotificationsDataTypes, ) {

    try {
      const notificationsDocRef = this.firestore
        .collection('notifications')
        .doc(id)
        .collection('notificationsData')
        .doc(idNotification);

    await notificationsDocRef.set(body, { merge: true }); // merge: true mantém os campos que não foram enviados


      return {
        message: 'Notificação atualizada com sucesso',
      };

    } catch (error) {
      this.logger.error(`Error sending push notification: ${error.message}`, error.stack);
      throw error;
    }
  }

async getNotifications(id: string) {
  const snapshot = await this.firestore
    .collection('notifications')
    .doc(id)
    .collection('notificationsData')
    .get();

  const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // iniciar escuta em tempo real
  this.firestore
    .collection('notifications')
    .doc(id)
    .collection('notificationsData')
    .onSnapshot((snap) => {
      const updatedNotifications = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.notificationsGateway.sendNotification(id, updatedNotifications);
    });

  return notifications; // dados iniciais via REST
}


}

