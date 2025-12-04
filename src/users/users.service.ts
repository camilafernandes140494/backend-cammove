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

async deleteUser(id: string, teacherId?: string): Promise<any> {
  let step = "Início"; // <-- Para rastrear em qual etapa caiu

  try {
    step = "Criando referências";
    const userRef = this.firestore.collection('users').doc(id);
    const workoutRef = this.firestore.collection('workouts').doc(id);
    const workoutsDayRef = this.firestore.collection('workoutsDay').doc(id);
    const assessmentRef = this.firestore.collection('assessments').doc(id);
    const assessmentsDayRef = this.firestore.collection('assessmentsDay').doc(id);
    const notificationRef = this.firestore.collection('notifications').doc(id);

    const workoutsSummaryRef = teacherId
      ? this.firestore.collection('workoutsSummary').doc(teacherId).collection('workouts').doc(id)
      : null;

    const assessmentsSummaryRef = teacherId
      ? this.firestore.collection('assessmentsSummary').doc(teacherId).collection('assessments').doc(id)
      : null;

    const schedulesRef = teacherId
      ? this.firestore.collection('schedules').doc(teacherId).collection('schedule')
      : null;

    step = "Verificando se usuário existe";
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new Error('Usuário não encontrado no Firestore');

    step = "Listando subcoleções";
    const subcollections = await userRef.listCollections();

    step = "Deletando subcoleções";
    const deleteSubcollections = subcollections.map(async (sub) => {
      const docs = await sub.listDocuments();
      return Promise.all(docs.map((doc) => doc.delete().catch(err => {
        throw new Error(`Erro ao deletar doc ${sub.id}/${doc.id}: ${err.message}`);
      })));
    });

    step = "Deletando coleções principais";
    const deleteTasks: Promise<any>[] = [
      userRef.delete().catch(err => { throw new Error("Erro ao deletar users: " + err.message); }),
      workoutRef.get().then((doc) => doc.exists && workoutRef.delete()),
      workoutsDayRef.get().then((doc) => doc.exists && workoutsDayRef.delete()),
      assessmentRef.get().then((doc) => doc.exists && assessmentRef.delete()),
      assessmentsDayRef.get().then((doc) => doc.exists && assessmentsDayRef.delete()),
      notificationRef.get().then((doc) => doc.exists && notificationRef.delete()),
    ];

    if (workoutsSummaryRef) {
      deleteTasks.push(
        workoutsSummaryRef.get().then((doc) =>
          doc.exists && workoutsSummaryRef.delete().catch(err => {
            throw new Error("Erro ao deletar workoutsSummary: " + err.message);
          })
        )
      );
    }

    if (assessmentsSummaryRef) {
      deleteTasks.push(
        assessmentsSummaryRef.get().then((doc) =>
          doc.exists && assessmentsSummaryRef.delete().catch(err => {
            throw new Error("Erro ao deletar assessmentsSummary: " + err.message);
          })
        )
      );
    }

    if (schedulesRef) {
      step = "Deletando schedules";
      const scheduleDocs = await schedulesRef.listDocuments();
      deleteTasks.push(...scheduleDocs.map((doc) =>
        doc.delete().catch(err => {
          throw new Error(`Erro ao deletar schedules/${doc.id}: ${err.message}`);
        })
      ));
    }

    step = "Executando deletes paralelos";
    await Promise.all([
      ...deleteSubcollections,
      ...deleteTasks,
    ]);

    step = "Deletando usuário do Auth";
    await admin.auth().deleteUser(id);

    return { message: 'Usuário deletado com sucesso' };

  } catch (error: any) {
    console.error(`❌ ERRO NA ETAPA: ${step}`);
    console.error(`❌ Detalhes:`, error);

    throw new Error(`Falha na etapa "${step}": ${error.message}`);
  }
}



}
