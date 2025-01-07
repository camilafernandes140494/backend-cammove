// src/migration/migration.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

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
        const doc = await permissionRef.get();

        if (!doc.exists) {
          // Adiciona permissão ao banco de dados
          await permissionRef.set({
            name: permission.name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`Permissão ${permission.name} criada com sucesso.`);
        }
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
