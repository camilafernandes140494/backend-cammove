import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Get,
} from '@nestjs/common';

import { WorkoutsDayService } from './workoutsDay.service';

@Controller('workouts-day')
export class WorkoutsDayController {
  constructor(private readonly workoutsDayService: WorkoutsDayService) {}

  // Endpoint para criar um review
  @Post('students/:studentId')
  async createReview(@Param('studentId') studentId: string) {
    return this.workoutsDayService.logTrainingDay(studentId);
  }

  // Endpoint para listar todos os reviews de um professor
  @Get('students/:studentId')
  @HttpCode(HttpStatus.OK)
  async getAllReviewsByProfessor(@Param('studentId') studentId: string) {
    return this.workoutsDayService.getTrainingDays(studentId);
  }
}
