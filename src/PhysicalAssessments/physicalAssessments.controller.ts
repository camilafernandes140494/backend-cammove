import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Patch,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { PhysicalAssessmentsService } from './physicalAssessments.service';
import { PhysicalAssessmentData } from './physicalAssessments.types';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('physical-assessment')
export class PhysicalAssessmentsController {
  constructor(
    private readonly physicalAssessmentsService: PhysicalAssessmentsService,
  ) {}

  // Endpoint para cadastrar avaliação física
  @Post('teachers/:teacherId/students/:studentId')
  @HttpCode(HttpStatus.CREATED)
  async createPhysicalAssessment(
    @Param('teacherId') teacherId: string,
    @Param('studentId') studentId: string,
    @Body()
    assessmentData: PhysicalAssessmentData,
  ) {
    const createdAt = new Date().toISOString();

    const expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + 1);
    const expireAt = expireDate.toISOString();

    return this.physicalAssessmentsService.createPhysicalAssessment(
      teacherId,
      studentId,
      assessmentData,
      createdAt,
      expireAt,
    );
  }

  @Patch(':assessmentsId/students/:studentId/teacher/:teacherId')
  @HttpCode(HttpStatus.OK)
  async updateAssessments(
    @Param('assessmentsId') assessmentsId: string,
    @Param('studentId') studentId: string,
    @Param('teacherId') teacherId: string,
    @Body() updateData: Partial<PhysicalAssessmentData>, // Permite atualizar campos específicos
  ) {
    return this.physicalAssessmentsService.updatePhysicalAssessment(
      teacherId,
      studentId,
      assessmentsId,
      updateData,
    );
  }

  @Delete(':assessmentsId/students/:studentId/teacher/:teacherId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePhysicalAssessment(
    @Param('assessmentsId') assessmentsId: string,
    @Param('studentId') studentId: string,
    @Param('teacherId') teacherId: string,
  ) {
    await this.physicalAssessmentsService.deletePhysicalAssessment(
      teacherId,
      studentId,
      assessmentsId,
    );
  }

  @Get('teachers/:teacherId/summary')
  @HttpCode(HttpStatus.OK)
  async getAssessmentByProfessor(@Param('teacherId') professorId: string) {
    return this.physicalAssessmentsService.getAssessmentsByProfessor(
      professorId,
    );
  }

  @Get('students/:studentsId')
  @HttpCode(HttpStatus.OK)
  async getAssessmentByStudentId(@Param('studentsId') studentsId: string) {
    return this.physicalAssessmentsService.getAssessmentsByStudentId(
      studentsId,
    );
  }

  @Get(':assessmentsId/students/:studentsId')
  @HttpCode(HttpStatus.OK)
  async getAssessmentByStudentIdAndWorkoutId(
    @Param('assessmentsId') assessmentsId: string,
    @Param('studentsId') studentsId: string,
  ) {
    return this.physicalAssessmentsService.getAssessmentsByStudentIdAndAssessmentsId(
      assessmentsId,
      studentsId,
    );
  }
}
