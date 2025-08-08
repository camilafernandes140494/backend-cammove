import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  Body,
} from '@nestjs/common';

import { WorkoutsDayService } from './workoutsDay.service';

@Controller('workouts-day')
export class WorkoutsDayController {
  constructor(private readonly workoutsDayService: WorkoutsDayService) {}

  // Endpoint para criar um review
  @Post('students/:studentId')
  async logTrainingDay(
  @Param('studentId') studentId: string,  
  @Body() workout: { nameWorkout: string; type?: string }) {
    return this.workoutsDayService.logTrainingDay(studentId, workout);
  }

  // Endpoint para listar todos os reviews de um professor
  @Get('students/:studentId')
  @HttpCode(HttpStatus.OK)
  async getTrainingDays(@Param('studentId') studentId: string) {
    return this.workoutsDayService.getTrainingDays(studentId);
  }
}
