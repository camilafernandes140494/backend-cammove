import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';

import { WorkoutData } from './workouts.types';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  // Endpoint para cadastrar um novo treino
  @Post('relationships/:relationshipId')
  @HttpCode(HttpStatus.CREATED)
  async createWorkout(
    @Param('relationshipId') relationshipIdId: string,
    @Body() workoutData: WorkoutData,
  ) {
    const createdAt = new Date().toISOString();
    return this.workoutsService.createWorkout(
      relationshipIdId,
      workoutData,
      createdAt,
    );
  }

  // Endpoint para atualizar um treino
  @Patch('relationships/:relationshipId/workouts/:workoutId')
  @HttpCode(HttpStatus.OK)
  async updateWorkout(
    @Param('relationshipId') relationshipIdId: string,
    @Param('workoutId') workoutId: string, // ID do treino
    @Body() workoutData: WorkoutData,
  ) {
    const updatedAt = new Date().toISOString();
    try {
      return await this.workoutsService.updateWorkout(
        relationshipIdId,
        workoutId,
        workoutData,
        updatedAt,
      );
    } catch (error) {
      throw new Error('Erro ao atualizar treino: ' + error.message);
    }
  }

  // Endpoint para excluir um treino
  @Delete('relationships/:relationshipId/workouts/:workoutId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWorkout(
    @Param('relationshipId') relationshipIdId: string,
    @Param('workoutId') workoutId: string, // ID do treino
  ) {
    try {
      return await this.workoutsService.deleteWorkout(
        relationshipIdId,
        workoutId,
      );
    } catch (error) {
      throw new Error('Erro ao excluir treino: ' + error.message);
    }
  }
}
