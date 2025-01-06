// src/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import admin from './firebase.config'; // Importando a configuração do Firebase

@Injectable()
export class FirebaseService {
  private db = admin.firestore(); // Acesso ao Firestore

  // Criar um novo post no Firestore
  async createPost(post: any): Promise<any> {
    try {
      const postRef = this.db.collection('posts').doc(); // Cria um novo documento
      await postRef.set(post); // Adiciona os dados ao Firestore
      return { id: postRef.id }; // Retorna o ID do post criado
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw new Error('Falha ao criar post no Firestore');
    }
  }

  // Obter todos os posts
  async getPosts(): Promise<any[]> {
    try {
      const snapshot = await this.db.collection('posts').get();
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error('Erro ao obter posts:', error);
      throw new Error('Falha ao obter posts do Firestore');
    }
  }
}
