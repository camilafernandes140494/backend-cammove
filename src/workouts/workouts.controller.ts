import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Get,
  Delete,
} from '@nestjs/common';

import { WorkoutData } from './workouts.types';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post('teachers/:teacherId/students/:studentId')
  @HttpCode(HttpStatus.CREATED)
  async createWorkout(
    @Param('teacherId') teacherId: string,
    @Param('studentId') studentId: string,
    @Body() workoutData: WorkoutData,
  ) {
    const createdAt = new Date().toISOString();

    const expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + 1);
    const expireAt = expireDate.toISOString();

    return this.workoutsService.createWorkout(
      teacherId,
      studentId,
      workoutData,
      createdAt,
      expireAt,
    );
  }

  @Get('teachers/:teacherId/summary')
  @HttpCode(HttpStatus.OK)
  async getWorkoutsByProfessor(@Param('teacherId') professorId: string) {
    return this.workoutsService.getWorkoutsByProfessor(professorId);
  }

  @Get('students/:studentsId')
  @HttpCode(HttpStatus.OK)
  async getWorkoutsByStudentId(@Param('studentsId') studentsId: string) {
    return this.workoutsService.getWorkoutsByStudentId(studentsId);
  }

  @Get(':workoutsId/students/:studentsId')
  @HttpCode(HttpStatus.OK)
  async getWorkoutByStudentIdAndWorkoutId(
    @Param('workoutsId') workoutsId: string,
    @Param('studentsId') studentsId: string,
  ) {
    return this.workoutsService.getWorkoutByStudentIdAndWorkoutId(
      workoutsId,
      studentsId,
    );
  }

  @Delete(':workoutId/students/:studentId/teacher/:teacherId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWorkout(
    @Param('workoutId') workoutId: string,
    @Param('studentId') studentId: string,
    @Param('teacherId') teacherId: string,
  ) {
    await this.workoutsService.deleteWorkout(teacherId, studentId, workoutId);
  }
}
