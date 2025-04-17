// review.service.ts
import * as admin from 'firebase-admin';

export class WorkoutsDayService {
  private firestore = admin.firestore();

  async logTrainingDay(studentId: string): Promise<any> {
    try {
      const now = new Date();

      // Ajusta para o horário de Brasília (UTC-3)
      const brazilOffsetMs = -3 * 60 * 60 * 1000;
      const brazilDate = new Date(now.getTime() + brazilOffsetMs);

      const trainedAt = now.toISOString(); // horário UTC real da máquina
      const dateId = brazilDate.toISOString().slice(0, 10); // data no horário do Brasil

      const ref = this.firestore
        .collection('workoutsDay')
        .doc(studentId)
        .collection('days')
        .doc(dateId); // salva com a data certa do Brasil

      await ref.set({ trainedAt });

      return {
        message: 'Dia de treino registrado!',
        date: trainedAt,
        savedAs: dateId, // mostra a data que foi salva
      };
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
