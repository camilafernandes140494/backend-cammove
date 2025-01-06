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

  // Método para login de um usuário - verificando o token JWT
  async loginUser(email: string, password: string) {
    // Lógica para autenticar o usuário, ex: usando Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);
    if (userRecord) {
      // Gerar o idToken após a autenticação bem-sucedida
      const idToken = await admin.auth().createCustomToken(userRecord.uid);
      return { idToken };
    } else {
      throw new Error('User not found');
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
