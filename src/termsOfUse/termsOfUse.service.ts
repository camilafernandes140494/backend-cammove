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
      .limit(1) // garante que só vem um
      .get();

    if (snapshot.empty) {
      return null; // nenhum termo ativo
    }

    const activeDoc = snapshot.docs[0];
    const data = activeDoc.data();

    return {
      id: activeDoc.id,
      content: data.content,
      createdAt: data.createdAt,
      isActive: data.isActive,
      version: data.version,
    };
  } catch (error) {
    throw new Error('Erro ao buscar termo ativo: ' + (error as Error).message);
  }
}

  async getAllTermsOfUse(): Promise<TermsOfUse[]> {
    try {
      const snapshot = await this.firestore
        .collection('terms_of_use')
        .get();

      if (snapshot.empty) {
        return []; // nenhum termo
      }

      const terms = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content,
          createdAt: data.createdAt,
          isActive: data.isActive,
          version: data.version,
        } as TermsOfUse;
      });

      return terms;
    } catch (error) {
      throw new Error('Erro ao buscar termos: ' + (error as Error).message);
    }
  }

  async createTermsOfUse(): Promise<any> {
  const termsJson = require('./termsOfUse.json');

    try {
    const docRef = this.firestore.collection('terms_of_use').doc('v-1.0.0')
    await docRef.update({
      ...termsJson,

      createdAt: new Date().toISOString(),
      deletedAt: '',
    });
  return { message: 'Termo de uso cadastrado com sucesso', id: 'v-1.0.0' };
  } catch (error) {
    throw new Error('Erro ao criar termo de uso: ' + (error as Error).message);
  }
}

}
