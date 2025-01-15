import { Injectable } from '@nestjs/common';
import { Exercise } from './exercises.types';
import admin from 'src/firebase/firebase.config';

@Injectable()
export class ExercisesService {
  private firestore = admin.firestore();

  async createExercise(exerciseData: Exercise): Promise<any> {
    try {
      const newExerciseRef = this.firestore.collection('exercises').doc();
      await newExerciseRef.set(exerciseData);
      return { message: 'Exercício criado com sucesso', id: newExerciseRef.id };
    } catch (error) {
      throw new Error('Erro ao salvar o exercício: ' + error.message);
    }
  }
}
