import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { RelationshipsService } from './relationships.service';

@Controller('relationships')
export class RelationshipsController {
  constructor(private readonly assignUsersService: RelationshipsService) {}

  // Rota para salvar usuário no Firestore
  @Post(':teacherId/:studentId')
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
}
