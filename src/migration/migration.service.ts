// src/migration/migration.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { initialExercises } from './exercises.seed';

@Injectable()
export class MigrationService implements OnModuleInit {
  private firestore = admin.firestore();

  // Método que vai rodar a migração
 async runMigrations() {
  // Migração de permissões
  const permissionsMigrationRef = this.firestore.collection('migrations').doc('permissions-v1');
  const permissionsMigrationDoc = await permissionsMigrationRef.get();

  if (!permissionsMigrationDoc.exists) {
    console.log('Iniciando migração de permissões...');
    const permissions = [
      { id: 'TEACHER', name: 'TEACHER' },
      { id: 'STUDENT', name: 'STUDENT' },
      { id: 'ADMIN', name: 'ADMIN' },
    ];

    for (const permission of permissions) {
      const permissionRef = this.firestore.collection('permissions').doc(permission.id);
      await permissionRef.set({
        id: permission.id,
        name: permission.name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    await permissionsMigrationRef.set({
      appliedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('Migração de permissões concluída.');
  } else {
    console.log('Migração de permissões já foi executada.');
  }

  // Migração de exercícios
  const exercisesMigrationRef = this.firestore.collection('migrations').doc('exercises-v1');
  const exercisesMigrationDoc = await exercisesMigrationRef.get();

if (!exercisesMigrationDoc.exists) {
  console.log('Iniciando migração de exercícios...');

  const batch = this.firestore.batch();
  const exercisesRef = this.firestore.collection('exercises').doc();

  for (const exercise of initialExercises) {
    batch.set(exercisesRef, {
      ...exercise,
      id: exercisesRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: '',
      deletedAt: '',
    });
  }

  await batch.commit();
  
  await exercisesMigrationRef.set({
    appliedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log('Migração de exercícios concluída.');
} else {
  console.log('Migração de exercícios já foi executada.');
}

}


  // Chama o método de migração ao iniciar o módulo
  async onModuleInit() {
    console.log('Iniciando migração...');
    await this.runMigrations(); // Roda as migrações
    console.log('Migrações realizadas.');
  }
}
