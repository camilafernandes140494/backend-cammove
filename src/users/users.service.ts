import { Injectable } from '@nestjs/common';
import { User, UpdateUser } from './user.types';
import admin from 'src/firebase/firebase.config';

@Injectable()
export class UsersService {
  private firestore = admin.firestore(); // Inicializa o Firestore

  // Método para salvar usuário no Firestore
  async createUser(id: string, userData: User): Promise<any> {
    try {
      const newUserRef = this.firestore.collection('users').doc(id);
      const user = await newUserRef.get();

      if (!user.exists) {
        // Cria o usuário com authProvider padrão (se não existir no userData)
        await newUserRef.set({
          ...userData,
          authProvider: userData.authProvider || 'EMAIL',
        });
        return { message: 'Usuário criado com sucesso', id: newUserRef.id };
      } else {
        // Atualiza apenas se o usuário já existe
        await newUserRef.update(userData);
        return { message: 'Usuário atualizado com sucesso', id: newUserRef.id };
      }
    } catch (error: any) {
      throw new Error('Erro ao salvar usuário: ' + error.message);
    }
  }

  // Método para atualizar usuário no Firestore
  async updateUser(id: string, userData: UpdateUser): Promise<any> {
    try {
      const userRef = this.firestore.collection('users').doc(id);
      const user = await userRef.get();

      if (!user.exists) {
        throw new Error('Usuário não encontrado');
      }

      await userRef.update(userData); // Atualiza os dados no Firestore
      return { message: 'Usuário atualizado com sucesso' };
    } catch (error) {
      throw new Error('Erro ao atualizar usuário: ' + error.message);
    }
  }

    async saveDeviceToken(id: string, deviceToken: string): Promise<any> {
    return this.updateUser(id, { deviceToken });
  }

  // Método para soft delete de um usuário
  async softDeleteUser(id: string): Promise<any> {
    try {
      const userRef = this.firestore.collection('users').doc(id);
      const user = await userRef.get();

      if (!user.exists) {
        throw new Error('Usuário não encontrado');
      }

      // Atualiza o campo 'deletedAt' com a data e hora atual
      const deletedAt = new Date().toISOString();

      // Limpa os campos 'createdAt' e 'updatedAt'
      const updateData = {
        deletedAt,
        updatedAt: '',
      };
      await userRef.update({
        deletedAt,
        ...updateData,
      });

      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      throw new Error('Erro ao deletar usuário: ' + error.message);
    }
  }

  async restoreUser(id: string): Promise<any> {
    try {
      const userRef = this.firestore.collection('users').doc(id);
      const user = await userRef.get();

      if (!user.exists) {
        throw new Error('Usuário não encontrado');
      }

      const updatedAt = new Date().toISOString();

      const updateData = {
        deletedAt: '',
        updatedAt,
      };

      await userRef.update(updateData);

      return { message: 'Usuário restaurado com sucesso' };
    } catch (error) {
      throw new Error('Erro ao restaurar usuário: ' + error.message);
    }
  }

  async getUserById(id: string): Promise<User> {
    const userRef = this.firestore.collection('users').doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Verifica se o documento existe
      throw new Error('Usuário não encontrado');
    }
    const userData = userDoc.data() as User;
    return { ...userData, id: userDoc.id };
  }

 async getUsers(filters: UpdateUser): Promise<User[]> {
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    this.firestore.collection('users');

  if (filters.name) {
    query = query
      .orderBy('name')
      .startAt(filters.name)
      .endAt(filters.name + '\uf8ff');
  }

  if (filters.gender) {
    query = query.where('gender', '==', filters.gender);
  }

  if (filters.deletedAt) {
    query = query.where('deletedAt', '==', filters.deletedAt);
  }

  if (filters.permission) {
    if (Array.isArray(filters.permission)) {
      // Caso receba um array de permissões
      query = query.where('permission', 'in', filters.permission);
    } else {
      // Caso seja uma string única
      query = query.where('permission', '==', filters.permission);
    }
  }

  if (filters.email) {
    query = query
      .orderBy('email')
      .startAt(filters.email)
      .endAt(filters.email + '\uf8ff');
  }

  const snapshot = await query.get();
  if (snapshot.empty) {
    return [];
  }

  const users: User[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as User;
    users.push({ ...data, id: doc.id });
  });

  return users;
}

}
