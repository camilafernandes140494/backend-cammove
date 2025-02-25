import * as admin from 'firebase-admin';
import { WorkoutData } from './workouts.types';

export class WorkoutsService {
  private firestore = admin.firestore();

  async createWorkout(
    teacherId: string, // Agora o ID do professor é obrigatório
    studentId: string,
    workoutData: WorkoutData,
    createdAt: string,
    expireAt: string,
  ): Promise<any> {
    try {
      // Criar o treino na subcoleção workoutsData dentro de workouts/{relationshipId}
      const workoutsCollectionRef = this.firestore
        .collection('workouts')
        .doc(studentId)
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

  async getWorkoutsByStudentId(studentsId: string): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection('workouts')
        .doc(studentsId)
        .collection('workoutsData')
        .get();

      if (snapshot.empty) {
        return { message: 'Nenhum treino encontrado.' };
      }

      // const workouts = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));

      return snapshot.docs.map((doc) => doc.id);
    } catch (error) {
      throw new Error('Erro ao buscar treinos: ' + error.message);
    }
  }

  async getWorkoutByStudentIdAndWorkoutId(
    workoutsId: string,
    studentsId: string,
  ): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection('workouts')
        .doc(studentsId)
        .collection('workoutsData')
        .doc(workoutsId)
        .get();

      if (!snapshot.exists) {
        // Verifica se o documento existe
        throw new Error('Treino não encontrado');
      }
      const workoutData = snapshot.data();
      return { ...workoutData, id: snapshot.id };
    } catch (error) {
      throw new Error('Erro ao buscar treinos: ' + error.message);
    }
  }

  async deleteWorkout(
    teacherId: string,
    studentId: string,
    workoutId: string,
  ): Promise<any> {
    try {
      // Referência para o treino na subcoleção workoutsData
      const workoutRef = this.firestore
        .collection('workouts')
        .doc(studentId)
        .collection('workoutsData')
        .doc(workoutId);

      // Referência para o resumo do treino dentro de workoutsSummary
      const summaryRef = this.firestore
        .collection('workoutsSummary')
        .doc(teacherId)
        .collection('workouts')
        .doc(workoutId);

      // Deletar os dois documentos simultaneamente
      await Promise.all([workoutRef.delete(), summaryRef.delete()]);

      return { message: 'Treino deletado com sucesso', id: workoutId };
    } catch (error) {
      throw new Error('Erro ao deletar treino: ' + error.message);
    }
  }

  async duplicateWorkout(
    teacherId: string,
    studentId: string,
    workoutId: string,
  ): Promise<any> {
    try {
      // Buscar o treino original
      const originalWorkoutRef = this.firestore
        .collection('workouts')
        .doc(studentId)
        .collection('workoutsData')
        .doc(workoutId);

      const originalWorkoutSnap = await originalWorkoutRef.get();

      if (!originalWorkoutSnap.exists) {
        throw new Error('Treino original não encontrado.');
      }

      const originalWorkoutData = originalWorkoutSnap.data();

      // Criar novas datas
      const createdAt = new Date().toISOString();
      const expireDate = new Date();
      expireDate.setMonth(expireDate.getMonth() + 1);
      const expireAt = expireDate.toISOString();

      // Criar novo treino com ID único
      const newWorkoutRef = this.firestore
        .collection('workouts')
        .doc(studentId)
        .collection('workoutsData')
        .doc();

      await newWorkoutRef.set({
        ...originalWorkoutData,
        createdAt,
      });

      // Criar novo resumo do treino
      const summaryRef = this.firestore
        .collection('workoutsSummary')
        .doc(teacherId)
        .collection('workouts')
        .doc(newWorkoutRef.id);

      await summaryRef.set({
        workoutId: newWorkoutRef.id,
        createdAt,
        expireAt,
        workoutType: originalWorkoutData.type,
        studentName: originalWorkoutData.studentName,
        studentId: originalWorkoutData.studentId,
      });

      return {
        message: 'Treino duplicado com sucesso',
        id: newWorkoutRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao duplicar treino: ' + error.message);
    }
  }
}
