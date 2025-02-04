import {
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { Exercise } from './exercises.types';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  // Rota para salvar usuário no Firestore
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: Exercise) {
    // Adicionando a data de criação automaticamente
    const createdAt = new Date().toISOString(); // Data de criação no formato ISO 8601
    const updatedAt = '';
    const deletedAt = '';

    const { name, type, description, images } = body;

    return this.exercisesService.createExercise({
      name,
      type,
      description,
      images,
      createdAt,
      updatedAt,
      deletedAt,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getExercise(
    @Query('name') name?: string,
    @Query('type') type?: string,
    @Query('deletedAt') deletedAt?: string,
    @Query('description') description?: string,
  ): Promise<Exercise[]> {
    try {
      const filters = { name, type, deletedAt, description };
      return await this.exercisesService.getExercises(filters);
    } catch (error) {
      console.error('Erro ao buscar exercicios: ', error);
      throw error;
    }
  }
}
