import { Module } from '@nestjs/common';

import { FirebaseService } from './firebase/firebase.service';
import { FirebaseController } from './firebase/firebase.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [AuthController, FirebaseController],
  providers: [AuthService, FirebaseService],
})
export class AppModule {}
