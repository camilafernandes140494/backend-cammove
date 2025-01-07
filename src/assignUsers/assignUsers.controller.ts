import { Controller, Post, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AssignUsersService } from './assignUsers.service';

@Controller('')
export class AssignUsersController {
  constructor(private readonly assignUsersService: AssignUsersService) {}

  // Rota para salvar usuário no Firestore
  @Post(':teacherId/assign/:studentId')
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
}
