// review.service.ts
import * as admin from 'firebase-admin';

export class WorkoutsDayService {
  private firestore = admin.firestore();

 async logTrainingDay(
  studentId: string,
  workout: { nameWorkout: string; type?: string }
): Promise<any> {
  try {
    const now = new Date();

    // Ajusta para o horário de Brasília (UTC-3)
    const brazilOffsetMs = -3 * 60 * 60 * 1000;
    const brazilDate = new Date(now.getTime() + brazilOffsetMs);

    const trainedAt = brazilDate.toISOString();
    const dateId = brazilDate.toISOString().slice(0, 10); // Ex: 2025-04-14

    const ref = this.firestore
      .collection('workoutsDay')
      .doc(studentId)
      .collection('days')
      .doc(dateId);

    await ref.set({
      trainedAt,
      nameWorkout: workout.nameWorkout,
      type: workout.type ?? null,
    });

    return {
      message: 'Dia de treino registrado!',
      date: trainedAt,
      savedAs: dateId,
    };
  } catch (error) {
    throw new Error('Erro ao registrar treino: ' + error.message);
  }
}


async getTrainingDays(
  studentId: string
): Promise<{ [date: string]: { nameWorkout: string; type?: string } }> {
  try {
    const snapshot = await this.firestore
      .collection('workoutsDay')
      .doc(studentId)
      .collection('days')
      .get();

    if (snapshot.empty) {
      return {};
    }

    const result: { [date: string]: { nameWorkout: string; type?: string } } = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      result[doc.id] = {
        nameWorkout: data.nameWorkout,
        type: data.type,
      };
    });

    return result;
  } catch (error) {
    throw new Error('Erro ao buscar dias de treino: ' + error.message);
  }
}

}
