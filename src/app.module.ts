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
import { ExercisesController } from './exercises/exercises.controller';
import { ExercisesService } from './exercises/exercises.service';
import { WorkoutsController } from './workouts/workouts.controller';
import { WorkoutsService } from './workouts/workouts.service';
import { SupabaseService } from './supabase/supabase.service';
import { UploadController } from './supabase/supabase.controller';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { ReviewService } from './review/review.service';
import { ReviewController } from './review/review.controller';
import { WorkoutsDayService } from './workoutsDay/workoutsDay.service';
import { WorkoutsDayController } from './workoutsDay/workoutsDay.controller';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleService } from './schedule/schedule.service';
import { S3Controller } from './s3/s3.controller';
import { S3Service } from './s3/s3.service';
import { OpenAiService } from './openai/openai.service';
import { OpenAiController } from './openai/openai.controller';
import { GeminiService } from './gemini/gemini.service';
import { GeminiController } from './gemini/gemini.controller';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsController } from './notifications/notifications.controller';

@Module({
  imports: [],
  controllers: [
    AuthController,
    UsersController,
    RelationshipsController,
    PhysicalAssessmentsController,
    ExercisesController,
    WorkoutsController,
    UploadController,
    EmailController,
    ReviewController,
    WorkoutsDayController,
    ScheduleController,
    S3Controller,
    OpenAiController,
    GeminiController,
    NotificationsController
  ],
  providers: [
    AuthService,
    UsersService,
    MigrationService,
    RelationshipsService,
    PhysicalAssessmentsService,
    ExercisesService,
    WorkoutsService,
    SupabaseService,
    EmailService,
    ReviewService,
    WorkoutsDayService,
    ScheduleService,
    S3Service,
    OpenAiService,
    GeminiService,
    NotificationsService
  ],
})
export class AppModule {}
