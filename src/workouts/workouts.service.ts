import * as admin from 'firebase-admin';
import { WorkoutData } from './workouts.types';

export class WorkoutsService {
  private firestore = admin.firestore();

  async createWorkout(
    relationshipId: string,
    workoutData: WorkoutData,
    createdAt: string,
  ): Promise<any> {
    try {
      // Criar o treino na subcoleção workoutsData
      const workoutsCollectionRef = this.firestore
        .collection('workouts')
        .doc(relationshipId)
        .collection('workoutsData');

      const newWorkoutRef = workoutsCollectionRef.doc();

      await newWorkoutRef.set({
        ...workoutData,
        createdAt,
      });

      // Criar um resumo do treino na coleção workoutsSummary
      const summaryRef = this.firestore
        .collection('workoutsSummary')
        .doc(newWorkoutRef.id);
      await summaryRef.set({
        workoutId: newWorkoutRef.id,
        createdAt,
        workoutType: workoutData.type, // Supondo que há um campo 'type' no workoutData
        personName: workoutData.studentName, // Nome da pessoa que recebeu o treino
      });

      return {
        message: 'Treino cadastrado com sucesso',
        id: newWorkoutRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao cadastrar treino: ' + error.message);
    }
  }

  async getWorkoutsSummary(): Promise<any> {
    try {
      const snapshot = await this.firestore.collection('workoutsSummary').get();

      if (snapshot.empty) {
        return { message: 'Nenhum treino encontrado.' };
      }

      const workouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return workouts;
    } catch (error) {
      throw new Error('Erro ao buscar treinos: ' + error.message);
    }
  }
}
