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
      const workoutsCollectionRef = this.firestore
        .collection('workouts')
        .doc(relationshipIdId)
        .collection('workoutsData'); // Subcoleção de workouts
      const newWorkoutRef = workoutsCollectionRef.doc(); // Gera um ID único para cada treino
      await newWorkoutRef.set({
        ...workoutData,
        createdAt,
      });

      return {
        message: 'Treino cadastrado com sucesso',
        id: newWorkoutRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao cadastrar treino: ' + error.message);
    }
  }

  async updateWorkout(
    relationshipIdId: string,
    workoutId: string, // Agora é necessário passar o ID do treino
    workoutData: WorkoutData,
    updatedAt: string,
  ): Promise<any> {
    try {
      const workoutRef = this.firestore
        .collection('workouts')
        .doc(relationshipIdId)
        .collection('workoutsData')
        .doc(workoutId); // Referência ao treino específico

      await workoutRef.update({
        ...workoutData,
        updatedAt,
      });

      return {
        message: 'Treino atualizado com sucesso',
        id: workoutRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao atualizar treino: ' + error.message);
    }
  }

  async deleteWorkout(
    relationshipIdId: string,
    workoutId: string, // Agora é necessário passar o ID do treino
  ): Promise<any> {
    try {
      const workoutRef = this.firestore
        .collection('workouts')
        .doc(relationshipIdId)
        .collection('workoutsData')
        .doc(workoutId); // Referência ao treino específico

      await workoutRef.delete();

      return {
        message: 'Treino excluído com sucesso',
        id: workoutId,
      };
    } catch (error) {
      throw new Error('Erro ao excluir treino: ' + error.message);
    }
  }
}
