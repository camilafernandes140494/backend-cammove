// common/common.module.ts
import { Module } from '@nestjs/common';
import { normalizeString } from './common'; // Certifique-se de importar a função

@Module({
  exports: [normalizeString], // Expõe a função para outros módulos
})
export class CommonModule {}
