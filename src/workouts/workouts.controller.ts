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

  // Endpoint para cadastrar avaliação física
  @Post('relationships/:relationshipId')
  @HttpCode(HttpStatus.CREATED)
  async createWorkout(
    @Param('relationshipId') relationshipIdId: string,
    @Body()
    workoutData: WorkoutData,
  ) {
    const createdAt = new Date().toISOString();
    return this.workoutsService.createWorkout(
      relationshipIdId,
      workoutData,
      createdAt,
    );
  }

  // Endpoint para atualizar avaliação física
  @Patch('relationships/:relationshipId')
  @HttpCode(HttpStatus.OK)
  async updateWorkout(
    @Param('relationshipId') relationshipIdId: string,
    @Body() workoutData: WorkoutData,
  ) {
    const updatedAt = new Date().toISOString();
    try {
      return await this.workoutsService.updateWorkout(
        relationshipIdId,
        workoutData,
        updatedAt,
      );
    } catch (error) {
      throw new Error('Erro ao atualizar avaliação física: ' + error.message);
    }
  }

  // Endpoint para excluir avaliação física
  @Delete('relationships/:relationshipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWorkout(@Param('relationshipId') relationshipIdId: string) {
    try {
      return await this.workoutsService.deleteWorkout(relationshipIdId);
    } catch (error) {
      throw new Error('Erro ao excluir avaliação física: ' + error.message);
    }
  }
}
