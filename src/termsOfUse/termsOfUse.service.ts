// termsOfUse.service.ts
import admin from 'src/firebase/firebase.config';
import { TermsOfUse } from './termsOfUse.types';

export class TermsOfUseService {
  private firestore = admin.firestore();

  async getActiveTermsOfUse(): Promise<TermsOfUse | null> {
    try {
      const snapshot = await this.firestore
        .collection('terms_of_use')
        .where('isActive', '==', true)
        .limit(1) // só deve existir um ativo
        .get();

      if (snapshot.empty) {
        return null; // ou pode lançar um erro
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        content: data.content,
        createdAt: data.createdAt,
        isActive: data.isActive,
        version: data.version,
      };
    } catch (error) {
      throw new Error('Erro ao buscar termo ativo: ' + error.message);
    }
  }
}
