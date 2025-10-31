// src/auth/auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      throw new HttpException(
        { message: "Esse e-mail já está registrado." },
        HttpStatus.BAD_REQUEST
      );
    }
    throw new HttpException(
      { message: "Erro ao registrar usuário: " + error.message },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
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

  // Método para autenticar o usuário
  async loginUser(email: string, password: string): Promise<any> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.APIKEY!}`;

    try {
      // Faz a requisição ao Firebase para validar o login usando fetch
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true, // Garante que o Firebase irá retornar um idToken
        }),
      });

      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao autenticar o usuário');
      }

      // Converte a resposta para JSON
      const data = await response.json();

      const user = await this.verifyToken(data.idToken);

      // Retorna os tokens
      return {...user, token: data.idToken, refreshToken: data.refreshToken};
    } catch (error) {
      throw new Error('Usuário ou senha inválidos' + error.message);
    }
  }

  // Método para logout de um usuário (apenas para frontend, pois o logout do Firebase é feito no cliente)
  async logoutUser(uid: string): Promise<void> {
    try {
      // Aqui você pode invalidar sessões ou realizar outras tarefas de logout, caso necessário
      console.log(uid);
    } catch (error) {
      throw new Error('Erro ao realizar logout: ' + error.message);
    }
  }

  // src/auth/auth.service.ts

  async sendPasswordResetEmail(email: string): Promise<any> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.APIKEY!}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro ao enviar e-mail de redefinição: ${errorData.error.message}`,
        );
      }

      return { message: 'Email de redefinição de senha enviado com sucesso.' };
    } catch (error) {
      throw new Error('Erro ao enviar e-mail de redefinição: ' + error.message);
    }
  }

  // src/auth/auth.service.ts
 async loginWithGoogle(googleIdToken: string): Promise<any> {
    const apiKey = process.env.APIKEY!;
    const exchangeUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`;

    try {
      // 1. TROCA DE TOKEN: Troca o Google ID Token (do Expo) por um Firebase ID Token
      const exchangeResponse = await fetch(exchangeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // O postBody usa query string format (não JSON)
          postBody: `id_token=${googleIdToken}&providerId=google.com`,
          requestUri: 'http://localhost', // URL arbitrária, mas necessária
          returnSecureToken: true, // Pede o idToken (Firebase) e refreshToken
        }),
      });

      if (!exchangeResponse.ok) {
        const errorData = await exchangeResponse.json();
        console.error("Erro na troca de token:", errorData);
        throw new Error(
          `Falha na troca de token: ${errorData.error.message}`,
        );
      }

      const exchangeData = await exchangeResponse.json();
      const firebaseIdToken = exchangeData.idToken;
      const refreshToken = exchangeData.refreshToken;
        
      // 2. VERIFICAÇÃO: Agora, verifica o ID Token emitido pelo Firebase
      const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
      const { uid, email, name, picture } = decodedToken;

      // O Admin SDK garante que o usuário existe no Firebase.
      // O `decodedToken` já tem as informações do usuário.
      
      return {
        uid: uid,
        email: email,
        displayName: name || null,
        photoURL: picture || null,
        token: firebaseIdToken, // O token correto para usar em rotas protegidas
        refreshToken: refreshToken,
      };
    } catch (error: any) {
      throw new HttpException(
        { message: 'Erro ao autenticar com Google: ' + error.message },
        HttpStatus.UNAUTHORIZED
      );
    }
  }

}
