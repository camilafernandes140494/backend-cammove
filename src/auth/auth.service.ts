// src/auth/auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import admin from '../firebase/firebase.config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  // Método para registrar um usuário
    constructor(private readonly usersService: UsersService) {} 

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

async refreshAccessToken(
  refreshToken: string
): Promise<{ idToken: string; refreshToken: string; expiresIn: number }> {
  if (!refreshToken) {
    throw new HttpException(
      { message: 'Refresh token é obrigatório.' },
      HttpStatus.BAD_REQUEST
    );
  }

  const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.APIKEY!}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro na renovação do token Firebase:', data);
      throw new HttpException(
        {
          message: 'Sessão inválida ou expirada. Faça login novamente.',
          code: data.error?.message || 'auth/invalid-refresh-token',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    // Retorna os novos tokens e tempo de expiração
    return {
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresIn: Number(data.expires_in), // geralmente "3600"
    };
  } catch (error) {
    if (error instanceof HttpException) throw error;

    throw new HttpException(
      { message: 'Erro interno ao renovar token.' },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}


  // src/auth/auth.service.ts
async loginWithGoogle(googleIdToken: string): Promise<any> {
  const apiKey = process.env.APIKEY!;
  const exchangeUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`;
  let userData = null
  let isNewUser = true;

  try {
    // 1. Troca o token Google -> Firebase
    const exchangeResponse = await fetch(exchangeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postBody: `id_token=${googleIdToken}&providerId=google.com`,
        requestUri: 'http://localhost',
        returnSecureToken: true,
      }),
    });

    if (!exchangeResponse.ok) {
      const errorData = await exchangeResponse.json();
      throw new Error(`Falha na troca de token: ${errorData.error.message}`);
    }

    const exchangeData = await exchangeResponse.json();
    const firebaseIdToken = exchangeData.idToken;
    const refreshToken = exchangeData.refreshToken;

    // 2. Verifica o ID Token do Firebase
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const { uid, email, name, picture } = decodedToken;

    // 3. Verifica se o usuário já existe no Firestore
    try {
      userData = await this.usersService.getUserById(uid);
      isNewUser = false;
      
    } catch {
      // Se não existir, cria
      await this.usersService.createUser(uid, {
        email,
        name: name || '',
        image: picture,
        createdAt: new Date().toISOString(),
        updatedAt: '',
        deletedAt: '',
        status: null,
        gender:'',
        birthDate:'',
        permission: null,
        phone:'',
        authProvider: 'GOOGLE',
      });
      isNewUser = true;
    }

    // 4. Retorna os dados
    return {
      uid,
      email,
      name: name || null,
      image: picture || null,
      token: firebaseIdToken,
      refreshToken,
      user: userData,
      isNewUser
    };
  } catch (error: any) {
    throw new HttpException(
      { message: 'Erro ao autenticar com Google: ' + error.message },
      HttpStatus.UNAUTHORIZED,
    );
  }
}


}
