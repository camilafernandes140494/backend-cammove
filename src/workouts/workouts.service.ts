import * as admin from 'firebase-admin';
import { WorkoutData } from './workouts.types';

export class WorkoutsService {
  private firestore = admin.firestore();

  async createWorkout(
    teacherId: string, // Agora o ID do professor é obrigatório
    relationshipId: string,
    workoutData: WorkoutData,
    createdAt: string,
    expireAt: string,
  ): Promise<any> {
    try {
      // Criar o treino na subcoleção workoutsData dentro de workouts/{relationshipId}
      const workoutsCollectionRef = this.firestore
        .collection('workouts')
        .doc(relationshipId)
        .collection('workoutsData');

      const newWorkoutRef = workoutsCollectionRef.doc();

      await newWorkoutRef.set({
        ...workoutData,
        createdAt,
      });

      // Criar um resumo do treino dentro de workoutsSummary/{professorId}/workouts/
      const summaryRef = this.firestore
        .collection('workoutsSummary')
        .doc(teacherId) // Criando um documento com ID do professor
        .collection('workouts')
        .doc(newWorkoutRef.id); // Criando um treino com ID único

      await summaryRef.set({
        workoutId: newWorkoutRef.id,
        createdAt,
        expireAt,
        workoutType: workoutData.type, // Tipo do treino
        studentName: workoutData.studentName,
        studentId: workoutData.studentId, // Nome da pessoa para quem é o treino
      });

      return {
        message: 'Treino cadastrado com sucesso',
        id: newWorkoutRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao cadastrar treino: ' + error.message);
    }
  }

  async getWorkoutsByProfessor(teacherId: string): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection('workoutsSummary')
        .doc(teacherId)
        .collection('workouts')
        .get();

      if (snapshot.empty) {
        return { message: 'Nenhum treino encontrado para este professor.' };
      }

      const workouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return workouts;
    } catch (error) {
      throw new Error('Erro ao buscar treinos do professor: ' + error.message);
    }
  }
}
