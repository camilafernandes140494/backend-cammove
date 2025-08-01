// src/migration/migration.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { initialExercises } from './exercises.seed';

@Injectable()
export class MigrationService implements OnModuleInit {
  private firestore = admin.firestore();

  // Método que vai rodar a migração
  async runMigrations() {
    const permissions = [
      { id: 'TEACHER', name: 'TEACHER' },
      { id: 'STUDENT', name: 'STUDENT' },
      { id: 'ADMIN', name: 'ADMIN' },
    ];

    // Verifica se a migração foi aplicada
    const migrationRef = this.firestore
      .collection('migrations')
      .doc('permissions-v1');
    const migrationDoc = await migrationRef.get();

    if (!migrationDoc.exists) {
      console.log('Iniciando migração de permissões...');

      for (const permission of permissions) {
        const permissionRef = this.firestore
          .collection('permissions')
          .doc(permission.id);
        await permissionRef.set({
          id: permission.id,
          name: permission.name,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
            for (const exercise of initialExercises) {
        const exercisesRef = this.firestore
          .collection('exercises').doc();
        await exercisesRef.set({
        ...exercise,
        id: exercisesRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: '',
        deletedAt: '',
        });
      }


      // Marca a migração como executada
      await migrationRef.set({
        appliedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('Migração de permissões concluída.');
    } else {
      console.log('Migração de permissões já foi executada.');
    }
  }

  // Chama o método de migração ao iniciar o módulo
  async onModuleInit() {
    console.log('Iniciando migração...');
    await this.runMigrations(); // Roda as migrações
    console.log('Migrações realizadas.');
  }
}
