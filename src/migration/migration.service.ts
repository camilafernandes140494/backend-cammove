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

      // Verifica se já existe o documento de permissões
      const permissionsRef = this.firestore
        .collection('permissions')
        .doc('data');
      const permissionsDoc = await permissionsRef.get();

      if (!permissionsDoc.exists) {
        // Adiciona todas as permissões ao banco de dados como um único documento
        await permissionsRef.set({
          permissions: permissions.map((permission) => ({
            id: permission.id,
            name: permission.name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          })),
        });
        console.log('Permissões criadas com sucesso.');
      } else {
        console.log('Documento de permissões já existe.');
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
