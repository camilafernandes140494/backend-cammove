// termsOfUse.service.ts
import admin from 'src/firebase/firebase.config';
import { TermsOfUse } from './termsOfUse.types';

export class TermsOfUseService {
  private firestore = admin.firestore();

  async getActiveTermsOfUse(): Promise<TermsOfUse | null> {
    try {
      // pega todos os documentos da coleção
      const snapshot = await this.firestore
        .collection('terms_of_use')
        .get();

      if (snapshot.empty) {
        return null; // nenhum termo cadastrado
      }

      // filtra manualmente o que tem isActive == true
      const activeDoc = snapshot.docs.find(doc => doc.data().isActive === true);

      if (!activeDoc) return null; // nenhum ativo

      const data = activeDoc.data();

      return {
        id: activeDoc.id,
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
