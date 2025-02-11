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

  @Post('relationships/:relationshipId')
  @HttpCode(HttpStatus.CREATED)
  async createWorkout(
    @Param('relationshipId') relationshipId: string,
    @Body() workoutData: WorkoutData,
  ) {
    const createdAt = new Date().toISOString();
    return this.workoutsService.createWorkout(
      relationshipId,
      workoutData,
      createdAt,
    );
  }

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  async getWorkoutsSummary() {
    return this.workoutsService.getWorkoutsSummary();
  }
}
