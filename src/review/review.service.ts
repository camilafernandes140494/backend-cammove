// review.service.ts
import * as admin from 'firebase-admin';
import { ReviewData } from './review.types';

export class ReviewService {
  private firestore = admin.firestore();

  async createReview(teacherId: string, reviewData: ReviewData): Promise<any> {
    try {
      const docId = `${reviewData.workoutId}_${reviewData.studentId}`;

      const ReviewRef = this.firestore
        .collection('reviews')
        .doc(teacherId)
        .collection('feedbacks')
        .doc(docId);

      await ReviewRef.set(reviewData);

      return {
        message: 'Feedback cadastrado com sucesso',
        id: docId,
      };
    } catch (error) {
      throw new Error('Erro ao cadastrar feedback: ' + error.message);
    }
  }

  async getReviewsByTeacher(teacherId: string, limit?: number): Promise<any[]> {
    try {
      let feedbacksRef = this.firestore
        .collection('reviews')
        .doc(teacherId)
        .collection('feedbacks')
        .orderBy('createdAt', 'desc');

      if (limit) {
        feedbacksRef = feedbacksRef.limit(limit);
      }

      const snapshot = await feedbacksRef.get();

      const reviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return reviews;
    } catch (error) {
      throw new Error('Erro ao buscar feedbacks: ' + error.message);
    }
  }

  async getReviewByWorkoutAndStudent(
    teacherId: string,
    workoutId: string,
    studentId: string,
  ): Promise<any> {
    try {
      const docId = `${workoutId}_${studentId}`;
      const reviewDoc = await this.firestore
        .collection('reviews')
        .doc(teacherId)
        .collection('feedbacks')
        .doc(docId)
        .get();

      if (!reviewDoc.exists) {
        return { message: 'Feedback não encontrado.' };
      }

      return {
        id: reviewDoc.id,
        ...reviewDoc.data(),
      };
    } catch (error) {
      throw new Error('Erro ao buscar feedback: ' + error.message);
    }
  }

  async getAllReviewByProfessor(teacherId: string): Promise<any> {
    try {
      const workoutsSnapshot = await this.firestore
        .collection('reviews')
        .doc(teacherId)
        .listCollections();

      const allReviews: any[] = [];

      for (const workoutCollection of workoutsSnapshot) {
        const reviewsSnapshot = await workoutCollection.get();

        reviewsSnapshot.forEach((doc) => {
          allReviews.push({
            id: doc.id,
            workoutId: workoutCollection.id,
            ...doc.data(),
          });
        });
      }

      return allReviews.length
        ? allReviews
        : { message: 'Nenhum feedback encontrado para este professor.' };
    } catch (error) {
      throw new Error(
        'Erro ao buscar feedbacks do professor: ' + (error as Error).message,
      );
    }
  }

  async deleteReview(
    teacherId: string,
    workoutId: string,
    studentId: string,
  ): Promise<any> {
    try {
      const docId = `${workoutId}_${studentId}`;

      await this.firestore
        .collection('reviews')
        .doc(teacherId)
        .collection('feedbacks')
        .doc(docId)
        .delete();

      return { message: 'Feedback deletado com sucesso', id: docId };
    } catch (error) {
      throw new Error('Erro ao deletar feedback: ' + error.message);
    }
  }

  async updateReview(
    teacherId: string,
    workoutId: string,
    studentId: string,
    updateData: Partial<ReviewData>,
  ): Promise<any> {
    try {
      const docId = `${workoutId}_${studentId}`;

      const reviewRef = this.firestore
        .collection('reviews')
        .doc(teacherId)
        .collection('feedbacks')
        .doc(docId);

      await reviewRef.update(updateData);

      return { message: 'Feedback atualizado com sucesso', id: docId };
    } catch (error) {
      throw new Error('Erro ao atualizar feedback: ' + error.message);
    }
  }
}
