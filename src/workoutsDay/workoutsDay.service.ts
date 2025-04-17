// review.service.ts
import * as admin from 'firebase-admin';

export class WorkoutsDayService {
  private firestore = admin.firestore();

  async logTrainingDay(studentId: string): Promise<any> {
    try {
      const trainedAt = new Date().toISOString();
      const dateId = trainedAt.slice(0, 10); // '2025-04-16'

      const ref = this.firestore
        .collection('workoutsDay')
        .doc(studentId)
        .collection('days')
        .doc(dateId); // 1 documento por dia

      await ref.set({ trainedAt });

      return { message: 'Dia de treino registrado!', date: trainedAt };
    } catch (error) {
      throw new Error('Erro ao registrar treino: ' + error.message);
    }
  }

  async getTrainingDays(studentId: string): Promise<string[]> {
    try {
      const snapshot = await this.firestore
        .collection('workoutsDay')
        .doc(studentId)
        .collection('days')
        .get();

      return snapshot.docs.map((doc) => doc.id); // retorna: ['2025-04-14', '2025-04-15', ...]
    } catch (error) {
      throw new Error('Erro ao buscar dias de treino: ' + error.message);
    }
  }
}
