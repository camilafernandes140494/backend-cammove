import { Module } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { MigrationService } from './migration/migration.service';
import { RelationshipsService } from './relationships/relationships.service';
import { RelationshipsController } from './relationships/relationships.controller';
import { PhysicalAssessmentsController } from './PhysicalAssessments/physicalAssessments.controller';
import { PhysicalAssessmentsService } from './PhysicalAssessments/physicalAssessments.service';

@Module({
  imports: [],
  controllers: [
    AuthController,
    UsersController,
    RelationshipsController,
    PhysicalAssessmentsController,
  ],
  providers: [
    AuthService,
    UsersService,
    MigrationService,
    RelationshipsService,
    PhysicalAssessmentsService,
  ],
})
export class AppModule {}
