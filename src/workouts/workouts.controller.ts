import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Get,
} from '@nestjs/common';

import { WorkoutData } from './workouts.types';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post('professors/:teacherId/relationships/:relationshipId')
  @HttpCode(HttpStatus.CREATED)
  async createWorkout(
    @Param('teacherId') teacherId: string,
    @Param('relationshipId') relationshipId: string,
    @Body() workoutData: WorkoutData,
  ) {
    const createdAt = new Date().toISOString();
    return this.workoutsService.createWorkout(
      teacherId,
      relationshipId,
      workoutData,
      createdAt,
    );
  }

  @Get('professors/:teacherId/workouts')
  @HttpCode(HttpStatus.OK)
  async getWorkoutsByProfessor(@Param('teacherId') professorId: string) {
    return this.workoutsService.getWorkoutsByProfessor(professorId);
  }
}
