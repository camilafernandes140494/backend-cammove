import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { RelationshipsService } from './relationships.service';

@Controller('relationships')
export class RelationshipsController {
  constructor(private readonly assignUsersService: RelationshipsService) {}

  // Rota para salvar usuário no Firestore
  @Post('teachers/:teacherId/students/:studentId')
  @HttpCode(HttpStatus.CREATED)
  async assignStudentToTeacher(
    @Param('teacherId') teacherId: string,
    @Param('studentId') studentId: string,
  ) {
    const createdAt = new Date().toISOString();
    return this.assignUsersService.assignStudentToTeacher(
      teacherId,
      studentId,
      createdAt,
    );
  }

  // Endpoint para atualizar parte do vínculo usando o ID e dados fornecidos
  @Patch(':relationshipId')
  async updateRelationship(
    @Param('relationshipId') relationshipId: string,
    @Body() updateData: { status?: string },
  ) {
    return this.assignUsersService.updateRelationship(
      relationshipId,
      updateData,
    );
  }

  @Get('teachers/:teacherId/students')
  async getStudentsOfTeacher(
    @Param('teacherId') teacherId: string,
    @Query('status') status: string | null,
  ) {
    return this.assignUsersService.getStudentsOfTeacher(teacherId, status);
  }

  @Get('students/:studentId/teacher')
  async getTeacherOfStudent(@Param('studentId') studentId: string) {
    return this.assignUsersService.getTeacherOfStudent(studentId);
  }

  @Get('teachers/:teacherId/students/:studentId')
  async getStatusRelationships(
    @Param('teacherId') teacherId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.assignUsersService.getStatusRelationships(teacherId, studentId);
  }
}
