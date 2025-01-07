import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Para gerar um nome único para o arquivo

@Injectable()
export class ExercisesService {
  private firestore = admin.firestore();
  private storage = admin.storage();

  async createExercise(exerciseData: any): Promise<any> {
    try {
      const exerciseRef = this.firestore.collection('exercises').doc();
      await exerciseRef.set(exerciseData);

      return {
        message: 'Exercício cadastrado com sucesso',
        id: exerciseRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao cadastrar exercício: ' + error.message);
    }
  }

  // Função para fazer upload da imagem para o Firebase Storage
  async uploadImageToStorage(image: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket();

    // Gerar um nome único para a imagem
    const fileName = `${uuidv4()}${path.extname(image.originalname)}`;

    // Referência do arquivo no Firebase Storage
    const file = bucket.file(fileName);

    // Fazendo o upload do arquivo
    await file.save(image.buffer, {
      contentType: image.mimetype,
      public: true, // Deixar o arquivo público
    });

    // Retornando a URL pública da imagem
    return file.publicUrl();
  }
}
