// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import admin from '../firebase/firebase.config';

@Injectable()
export class AuthService {
  // Método para registrar um usuário
  async registerUser(email: string, password: string): Promise<any> {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });
      return userRecord;
    } catch (error) {
      throw new Error('Erro ao registrar usuário: ' + error.message);
    }
  }

  // Método para autenticar o usuário
  async loginUser(email: string, password: string) {
    // URL da API do Firebase para autenticação

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.PRIVATE_KEY!}`;
    console.log(url);
    try {
      // Faz a requisição usando fetch
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to login user');
      }
      return response.json();
      // const { idToken, refreshToken, localId } = await response.json();

      // // Gera um token JWT customizado usando o Firebase Admin SDK
      // const customToken = await admin.auth().createCustomToken(localId);

      // return {
      //   idToken, // Token JWT do Firebase
      //   refreshToken, // Token de renovação
      //   customToken, // Token customizado gerado pelo Firebase Admin SDK
      // };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login user');
    }
  }

  // Método para logout de um usuário (apenas para frontend, pois o logout do Firebase é feito no cliente)
  async logoutUser(uid: string): Promise<void> {
    try {
      // Aqui você pode invalidar sessões ou realizar outras tarefas de logout, caso necessário
    } catch (error) {
      throw new Error('Erro ao realizar logout: ' + error.message);
    }
  }

  // Método para verificar o token do usuário
  async verifyToken(idToken: string): Promise<any> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken; // Retorna as informações decodificadas do token
    } catch (error) {
      throw new Error('Token inválido ou expirado: ' + error.message);
    }
  }
}
