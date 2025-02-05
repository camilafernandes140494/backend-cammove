import { Injectable } from '@nestjs/common';
import { Exercise, UpdateExercise } from './exercises.types';
import admin from 'src/firebase/firebase.config';

@Injectable()
export class ExercisesService {
  private firestore = admin.firestore();

  async createExercise(exerciseData: Exercise): Promise<any> {
    try {
      // Cria um novo documento na coleção 'exercises' com dados de 'exerciseData'
      const newExerciseRef = this.firestore.collection('exercises').doc();

      // Armazena o objeto diretamente como o conteúdo do documento
      await newExerciseRef.set(exerciseData);

      // Retorna uma mensagem com o ID do documento criado
      return { message: 'Exercício criado com sucesso', id: newExerciseRef.id };
    } catch (error) {
      // Se ocorrer um erro, lança uma exceção com a mensagem de erro
      throw new Error('Erro ao salvar o exercício: ' + error.message);
    }
  }

  async getExercises(filters: UpdateExercise): Promise<Exercise[]> {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      this.firestore.collection('exercises');

    // Aplica os filtros fornecidos
    if (filters.name) {
      query = query
        .orderBy('name')
        .startAt(filters.name)
        .endAt(filters.name + '\uf8ff');
    }
    if (filters.description) {
      query = query
        .orderBy('description')
        .startAt(filters.description)
        .endAt(filters.description + '\uf8ff');
    }
    if (filters.deletedAt) {
      query = query.where('deletedAt', '==', filters.deletedAt);
    }
    if (filters.category) {
      query = query
        .orderBy('category')
        .startAt(filters.category)
        .endAt(filters.category + '\uf8ff');
    }
    if (filters.muscleGroup) {
      query = query
        .orderBy('muscleGroup')
        .startAt(filters.muscleGroup)
        .endAt(filters.muscleGroup + '\uf8ff');
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
      return [];
    }

    const exercises: Exercise[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Exercise;
      exercises.push(data);
    });

    return exercises;
  }
}
