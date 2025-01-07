import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AssignUsersService {
  private firestore = admin.firestore(); // Inicializa o Firestore

  async assignStudentToTeacher(
    teacherId: string,
    studentId: string,
    createdAt: string,
  ): Promise<any> {
    try {
      const teacherRef = this.firestore.collection('users').doc(teacherId);
      const studentRef = this.firestore.collection('users').doc(studentId);

      // Verificar se ambos os usuários existem e têm as permissões corretas
      const teacher = await teacherRef.get();
      const student = await studentRef.get();

      if (!teacher.exists || !student.exists) {
        throw new Error('Professor ou aluno não encontrado');
      }

      if (
        teacher.data()?.role !== 'TEACHER' ||
        student.data()?.role !== 'STUDENT'
      ) {
        throw new Error('Permissões inválidas para criar vínculo');
      }

      // Criar o vínculo na coleção "relationships"
      const relationshipRef = this.firestore.collection('relationships').doc();
      await relationshipRef.set({
        teacherId,
        studentId,
        createdAt,
        status: 'active', // ou 'pending', dependendo do fluxo
      });

      return { message: 'Vínculo criado com sucesso', id: relationshipRef.id };
    } catch (error) {
      throw new Error('Erro ao criar vínculo: ' + error.message);
    }
  }
}
