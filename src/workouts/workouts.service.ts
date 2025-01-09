import * as admin from 'firebase-admin';
import { WorkoutData } from './workouts.types';

export class WorkoutsService {
  private firestore = admin.firestore();

  async createWorkout(
    relationshipIdId: string,
    workoutData: WorkoutData,
    createdAt: string,
  ): Promise<any> {
    try {
      const assessmentRef = this.firestore
        .collection('workouts')
        .doc(relationshipIdId);
      await assessmentRef.set({
        ...workoutData,
        // Timestamp de criação
        createdAt,
      });

      return {
        message: 'Treino cadastrada com sucesso',
        id: assessmentRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao cadastrar treino: ' + error.message);
    }
  }

  async updateWorkout(
    relationshipIdId: string,
    workoutData: WorkoutData,
    updatedAt: string,
  ): Promise<any> {
    try {
      const assessmentRef = this.firestore
        .collection('workouts')
        .doc(relationshipIdId);

      // Atualiza apenas os campos fornecidos
      await assessmentRef.update({
        ...workoutData,
        updatedAt,
      });

      return {
        message: 'Treino atualizada com sucesso',
        id: assessmentRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao atualizar treino: ' + error.message);
    }
  }

  async deleteWorkout(relationshipIdId: string): Promise<any> {
    try {
      const assessmentRef = this.firestore
        .collection('workouts')
        .doc(relationshipIdId);

      await assessmentRef.delete();

      return {
        message: 'Treino excluída com sucesso',
        id: relationshipIdId,
      };
    } catch (error) {
      throw new Error('Erro ao excluir Treino: ' + error.message);
    }
  }
}
