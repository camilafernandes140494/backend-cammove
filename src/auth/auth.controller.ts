// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Rota para registrar o usuário
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.registerUser(email, password);
  }

  // Rota para login de um usuário
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.loginUser(email, password);
  }

  // Rota para verificar o token do usuário
  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Body() body: { idToken: string }) {
    const { idToken } = body;
    return this.authService.verifyToken(idToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    const { email } = body;
    return this.authService.sendPasswordResetEmail(email);
  }
}
