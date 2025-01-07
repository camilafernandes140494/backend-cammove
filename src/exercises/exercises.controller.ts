import {
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Controller,
} from '@nestjs/common';
import { Exercise } from './exercises.types';
import { ExercisesService } from './exercises.service'; // Importe o serviço para interação com a base de dados
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { FileInterceptor } from '@nestjs/platform-express'; // Importar o FileInterceptor

@Controller('exercises') // Define a rota base para o controlador
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() })) // Usando o interceptor do multer
  async createExercise(
    @Body() body: Exercise,
    @UploadedFile() file: Express.Multer.File, // Aqui usamos a tipagem correta do multer para Express
  ) {
    // Processamento do arquivo e link para o Firebase Storage
    if (file) {
      const fileName = `${uuidv4()}.${file.mimetype.split('/')[1]}`; // Gerando nome único para o arquivo
      const fileBuffer = file.buffer;

      const storageRef = admin.storage().bucket();
      const fileRef = storageRef.file(fileName);

      // Enviando o arquivo para o Firebase Storage
      await fileRef.save(fileBuffer, {
        contentType: file.mimetype,
        public: true, // Tornar o arquivo público
      });

      const fileLink = `https://storage.googleapis.com/${storageRef.name}/${fileName}`; // Link público

      // Agora você pode salvar os dados do exercício com o link da imagem
      return this.exercisesService.createExercise({
        ...body,
        imageUrl: fileLink, // Link da imagem no Firebase Storage
      });
    }

    // Caso não haja arquivo, salva sem a imagem
    return this.exercisesService.createExercise({
      ...body,
      imageUrl: '',
    });
  }
}
