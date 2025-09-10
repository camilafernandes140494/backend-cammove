import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import admin from 'src/firebase/firebase.config';
import { NotificationsDataTypes } from './notifications.types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
    private firestore = admin.firestore();

  // Não foi possivel utilizar o websocket, pois o vercel nao suporta websocket
  // constructor(private notificationsGateway: NotificationsGateway) {
  //   this.initRealtimeListeners();
  // }

  // private initRealtimeListeners() {
  //   this.firestore
  //     .collection('notifications')
  //     .onSnapshot(snapshot => {
  //       snapshot.docs.forEach(async doc => {
  //         const id = doc.id;
  //         const notificationsSnapshot = await doc.ref.collection('notificationsData').get();
  //         const notifications = notificationsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  //         this.notificationsGateway.sendNotification(id, notifications);
  //       });
  //     }, error => {
  //       this.logger.error('Error on Firestore snapshot listener', error);
  //     });
  // }

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

