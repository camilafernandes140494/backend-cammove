import { PhysicalAssessmentData } from './physicalAssessments.types';
import * as admin from 'firebase-admin';

export class PhysicalAssessmentsService {
  private firestore = admin.firestore();

  async createPhysicalAssessment(
    relationshipIdId: string,
    assessmentData: PhysicalAssessmentData,
    createdAt: string,
  ): Promise<any> {
    try {
      const assessmentRef = this.firestore
        .collection('physical_assessments')
        .doc(relationshipIdId);
      await assessmentRef.set({
        ...assessmentData,
        createdAt,
      });

      return {
        message: 'Avaliação física cadastrada com sucesso',
        id: assessmentRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao cadastrar avaliação física: ' + error.message);
    }
  }

  async updatePhysicalAssessment(
    relationshipIdId: string,
    assessmentData: PhysicalAssessmentData,
    updatedAt: string,
  ): Promise<any> {
    try {
      const assessmentRef = this.firestore
        .collection('physical_assessments')
        .doc(relationshipIdId);

      // Atualiza apenas os campos fornecidos
      await assessmentRef.update({
        ...assessmentData,
        updatedAt,
      });

      return {
        message: 'Avaliação física atualizada com sucesso',
        id: assessmentRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao atualizar avaliação física: ' + error.message);
    }
  }

  async deletePhysicalAssessment(relationshipIdId: string): Promise<any> {
    try {
      const assessmentRef = this.firestore
        .collection('physical_assessments')
        .doc(relationshipIdId);

      await assessmentRef.delete();

      return {
        message: 'Avaliação física excluída com sucesso',
        id: relationshipIdId,
      };
    } catch (error) {
      throw new Error('Erro ao excluir avaliação física: ' + error.message);
    }
  }
}
