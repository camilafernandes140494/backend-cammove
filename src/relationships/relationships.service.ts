import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class RelationshipsService {
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
        teacher.data()?.permission !== 'TEACHER' ||
        student.data()?.permission !== 'STUDENT'
      ) {
        throw new Error('Permissões inválidas para criar vínculo');
      }

      const relationshipRef = this.firestore.collection('relationships').doc();
      await relationshipRef.set({
        teacherId,
        studentId,
        createdAt,
        status: 'ACTIVE',
        id: relationshipRef.id,
      });

      return { message: 'Vínculo criado com sucesso', id: relationshipRef.id };
    } catch (error) {
      throw new Error('Erro ao criar vínculo: ' + error.message);
    }
  }
  async updateRelationship(
    relationshipId: string,
    updateData: { status?: string; [key: string]: any },
  ): Promise<any> {
    try {
      const relationshipRef = this.firestore
        .collection('relationships')
        .doc(relationshipId);
      const doc = await relationshipRef.get();

      if (!doc.exists) {
        throw new Error('Vínculo não encontrado');
      }

      // Atualiza apenas os campos fornecidos
      const dataToUpdate: any = {};

      if (updateData.status) {
        dataToUpdate.status = updateData.status;
      }

      // Adicione aqui qualquer outra lógica para atualizar outros campos, se necessário
      dataToUpdate.updatedAt = new Date().toISOString();

      if (Object.keys(dataToUpdate).length === 0) {
        throw new Error('Nenhum dado válido para atualizar');
      }

      await relationshipRef.update(dataToUpdate);

      return {
        message: 'Vínculo atualizado com sucesso',
        updatedFields: dataToUpdate,
      };
    } catch (error) {
      throw new Error('Erro ao atualizar vínculo: ' + error.message);
    }
  }

  async getStudentsOfTeacher(teacherId: string, status?: string): Promise<any> {
    try {
      // Busca os relacionamentos onde o professor é o teacherId
      const relationshipsSnapshot = await this.firestore
        .collection('relationships')
        .where('teacherId', '==', teacherId)
        .get();

      if (relationshipsSnapshot.empty) {
        return { students: [] };
      }

      // Lista de IDs de alunos
      const studentIds = relationshipsSnapshot.docs.map(
        (doc) => doc.data().studentId,
      );

      // Busca os documentos dos estudantes
      const studentsSnapshot = await this.firestore
        .collection('users')
        .where(admin.firestore.FieldPath.documentId(), 'in', studentIds)
        .get();

      // Mapeia os dados retornados
      let students = studentsSnapshot.docs.map((doc) => ({
        studentId: doc.id,
        studentName: doc.data().name || 'Nome não disponível',
        studentStatus: doc.data().status || 'INACTIVE',
      }));

      // Aplica o filtro por status se for uma string válida
      if (status) {
        students = students.filter(
          (student) => student.studentStatus === status,
        );
      }

      return { students };
    } catch (error) {
      throw new Error('Erro ao buscar alunos: ' + error.message);
    }
  }

  async getTeacherOfStudent(studentId: string): Promise<any> {
    try {
      // Busca os relacionamentos onde o professor é o teacherId
      const relationshipsSnapshot = await this.firestore
        .collection('relationships')
        .where('studentId', '==', studentId)
        .limit(1)
        .get();

      if (relationshipsSnapshot.empty) {
        return null;
      }
      return relationshipsSnapshot.docs[0].data();
    } catch (error) {
      throw new Error('Erro ao buscar alunos: ' + error.message);
    }
  }

  async getStatusRelationships(
    teacherId: string,
    studentId: string,
  ): Promise<any> {
    try {
      // Busca os relacionamentos onde o professor é o teacherId
      const relationshipsSnapshot = await this.firestore
        .collection('relationships')
        .where('teacherId', '==', teacherId)
        .where('studentId', '==', studentId)
        .limit(1)
        .get();

      if (relationshipsSnapshot.empty) {
        return null;
      }

      return relationshipsSnapshot.docs[0].data();
    } catch (error) {
      throw new Error('Erro ao buscar alunos: ' + error.message);
    }
  }
}
