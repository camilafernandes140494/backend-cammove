import { PhysicalAssessmentData } from './physicalAssessments.types';
import admin from 'src/firebase/firebase.config';

export class PhysicalAssessmentsService {
  private firestore = admin.firestore();

  async createPhysicalAssessment(
    teacherId: string, // Agora o ID do professor é obrigatório
    studentId: string,
    physicalAssessmentData: PhysicalAssessmentData,
    createdAt: string,
    expireAt: string,
  ): Promise<any> {
    try {
      // Criar o treino na subcoleção workoutsData dentro de workouts/{relationshipId}
      const assessmentsCollectionRef = this.firestore
        .collection('assessments')
        .doc(studentId)
        .collection('assessmentsData');

      const newAssessmentsRef = assessmentsCollectionRef.doc();

      await newAssessmentsRef.set({
        ...physicalAssessmentData,
        createdAt,
      });

      // Criar um resumo do treino dentro de workoutsSummary/{professorId}/workouts/
      const summaryRef = this.firestore
        .collection('assessmentsSummary')
        .doc(teacherId) // Criando um documento com ID do professor
        .collection('assessments')
        .doc(newAssessmentsRef.id); // Criando um treino com ID único

      await summaryRef.set({
        assessmentsId: newAssessmentsRef.id,
        createdAt,
        expireAt,
        studentName: physicalAssessmentData.studentName,
        studentId: physicalAssessmentData.studentId, // Nome da pessoa para quem é o treino
      });

      return {
        message: 'Avaliação cadastrado com sucesso',
        id: newAssessmentsRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao cadastrar avaliação: ' + error.message);
    }
  }

  async updatePhysicalAssessment(
    teacherId: string,
    studentId: string,
    assessmentsId: string,
    updateData: Partial<PhysicalAssessmentData>,
  ): Promise<any> {
    try {
      const assessmentsRef = this.firestore
        .collection('assessments')
        .doc(studentId)
        .collection('assessmentsData')
        .doc(assessmentsId);

      // Atualizar os dados do treino
      await assessmentsRef.update(updateData);

      // Atualizar também o resumo do treino
      const summaryRef = this.firestore
        .collection('assessmentsSummary')
        .doc(teacherId)
        .collection('assessments')
        .doc(assessmentsId);

      // Atualiza apenas os campos enviados no `updateData`
      await summaryRef.update({ ...updateData, assessmentsId: assessmentsId });

      return { message: 'Avaliação atualizada com sucesso', id: assessmentsId };
    } catch (error) {
      throw new Error('Erro ao atualizar a avaliação: ' + error.message);
    }
  }

  async deletePhysicalAssessment(
    teacherId: string,
    studentId: string,
    assessmentsId: string,
  ): Promise<any> {
    try {
      // Referência para o treino na subcoleção workoutsData
      const assessmentsRef = this.firestore
        .collection('assessments')
        .doc(studentId)
        .collection('assessmentsData')
        .doc(assessmentsId);

      // Referência para o resumo do treino dentro de workoutsSummary
      const summaryRef = this.firestore
        .collection('assessmentsSummary')
        .doc(teacherId)
        .collection('assessments')
        .doc(assessmentsId);

      // Deletar os dois documentos simultaneamente
      await Promise.all([assessmentsRef.delete(), summaryRef.delete()]);

      return {
        message: 'Avaliação física excluída com sucesso',
        id: assessmentsId,
      };
    } catch (error) {
      throw new Error('Erro ao excluir avaliação física: ' + error.message);
    }
  }

  async getAssessmentsByProfessor(teacherId: string): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection('assessmentsSummary')
        .doc(teacherId)
        .collection('assessments')
        .get();

      if (snapshot.empty) {
        return { message: 'Nenhuma avaliação encontrada para este professor.' };
      }

      const assessments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return assessments;
    } catch (error) {
      throw new Error(
        'Erro ao buscar avaliações do professor: ' + error.message,
      );
    }
  }

  async getAssessmentsByStudentId(studentsId: string): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection('assessments')
        .doc(studentsId)
        .collection('assessmentsData')
        .get();

      if (snapshot.empty) {
        return { message: 'Nenhuma avaliação encontrada.' };
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt: data.createdAt,
        };
      });
    } catch (error) {
      throw new Error('Erro ao buscar avaliações: ' + error.message);
    }
  }

  async getAssessmentsByStudentIdAndAssessmentsId(
    assessmentsId: string,
    studentsId: string,
  ): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection('assessments')
        .doc(studentsId)
        .collection('assessmentsData')
        .doc(assessmentsId)
        .get();

      if (!snapshot.exists) {
        // Verifica se o documento existe
        throw new Error('Treino não encontrado');
      }
      const assessmentsData = snapshot.data();
      return { ...assessmentsData, id: snapshot.id };
    } catch (error) {
      throw new Error('Erro ao buscar avaliações: ' + error.message);
    }
  }
}
