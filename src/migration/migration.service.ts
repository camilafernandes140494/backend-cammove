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
      .doc('permissions-v2');
    const migrationDoc = await migrationRef.get();

    if (!migrationDoc.exists) {
      console.log('Iniciando migração de permissões...');

      const permissionsRef = this.firestore
        .collection('permissions')
        .doc('data');
      const permissionsDoc = await permissionsRef.get();

      if (!permissionsDoc.exists) {
        try {
          // Adiciona todas as permissões como um único array
          await permissionsRef.set({
            permissions: permissions.map((permission) => ({
              id: permission.id,
              name: permission.name,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            })),
          });
          console.log('Permissões criadas com sucesso.');
        } catch (error) {
          console.error('Erro ao criar permissões:', error);
        }
      } else {
        console.log('Documento de permissões já existe.');
      }

      try {
        // Marca a migração como executada
        await migrationRef.set({
          appliedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('Migração de permissões concluída.');
      } catch (error) {
        console.error('Erro ao marcar migração como executada:', error);
      }
    } else {
      console.log('Migração de permissões já foi executada.');
    }
  }

  // Chama o método de migração ao iniciar o módulo
  async onModuleInit() {
    console.log('Iniciando migração...');
    try {
      await this.runMigrations(); // Roda as migrações
      console.log('Migrações realizadas.');
    } catch (error) {
      console.error('Erro ao realizar migração:', error);
    }
  }
}
