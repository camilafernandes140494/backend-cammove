import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Get,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';

import { ReviewService } from './review.service';
import { ReviewData } from './review.types';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Endpoint para criar um review
  @Post('teachers/:teacherId/students/:studentId')
  async createReview(
    @Param('teacherId') teacherId: string,
    @Param('studentId') studentId: string,
    @Body() reviewData: ReviewData,
  ) {
    const createdAt = new Date().toISOString();

    return this.reviewService.createReview(teacherId, studentId, {
      ...reviewData,
      teacherId, // <-- sempre da URL
      createdAt,
    });
  }

  @Get('teachers/:teacherId/reviews')
  async getReviewsByTeacher(
    @Param('teacherId') teacherId: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    return this.reviewService.getReviewsByTeacher(teacherId, parsedLimit);
  }

  // Endpoint para obter review por professor, workout e aluno
  @Get('teachers/:teacherId/students/:studentId/workouts/:workoutId')
  @HttpCode(HttpStatus.OK)
  async getReviewByWorkoutAndStudent(
    @Param('teacherId') teacherId: string,
    @Param('workoutId') workoutId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.reviewService.getReviewByWorkoutAndStudent(
      teacherId,
      workoutId,
      studentId,
    );
  }

  // Endpoint para listar todos os reviews de um professor
  @Get('teachers/:teacherId')
  @HttpCode(HttpStatus.OK)
  async getAllReviewsByProfessor(@Param('teacherId') teacherId: string) {
    return this.reviewService.getAllReviewByProfessor(teacherId);
  }

  // Endpoint para deletar um review
  @Delete('teachers/:teacherId/students/:studentId/workouts/:workoutId')
  @HttpCode(HttpStatus.OK)
  async deleteReview(
    @Param('teacherId') teacherId: string,
    @Param('workoutId') workoutId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.reviewService.deleteReview(teacherId, workoutId, studentId);
  }

  // Endpoint para atualizar um review
  @Patch('teachers/:teacherId/students/:studentId/workouts/:workoutId')
  @HttpCode(HttpStatus.OK)
  async updateReview(
    @Param('teacherId') teacherId: string,
    @Param('workoutId') workoutId: string,
    @Param('studentId') studentId: string,
    @Body() updateData: Partial<ReviewData>,
  ) {
    return this.reviewService.updateReview(
      teacherId,
      workoutId,
      studentId,
      updateData,
    );
  }
}
