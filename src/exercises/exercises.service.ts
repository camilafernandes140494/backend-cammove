import { Injectable } from '@nestjs/common';
import { Exercise } from './exercises.types';
import admin from 'src/firebase/firebase.config';

@Injectable()
export class ExercisesService {
  private firestore = admin.firestore();
  private collection = 'exercises'; // Cada exercício será um documento nesta coleção

  async createExercise(exercise: Exercise): Promise<any> {
    try {
      const newExerciseRef = this.firestore.collection(this.collection).doc();

      await newExerciseRef.set({
        ...exercise,
        id: newExerciseRef.id, // Armazena o ID do documento
        createdAt: new Date().toISOString(),
        updatedAt: '',
        deletedAt: '',
      });

      return { message: 'Exercício criado com sucesso', id: newExerciseRef.id };
    } catch (error) {
      throw new Error('Erro ao salvar o exercício: ' + error.message);
    }
  }

  async getExercises(filters: Partial<Exercise>): Promise<Exercise[]> {
    let query: FirebaseFirestore.Query = this.firestore.collection(
      this.collection,
    );

    if (filters.category) {
      query = query
        .orderBy('category')
        .startAt(filters.category)
        .endAt(filters.category + '\uf8ff'); // "\uf8ff" para capturar qualquer string após o prefixo
    }

    if (filters.muscleGroup) {
      query = query.where(
        'muscleGroup',
        'array-contains-any',
        filters.muscleGroup,
      );
    }

    if (filters.name) {
      query = query
        .orderBy('name')
        .startAt(filters.name)
        .endAt(filters.name + '\uf8ff'); // "\uf8ff" para capturar qualquer string após o prefixo
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data() as Exercise);
  }
}
