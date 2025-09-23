// src/auth/auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    try {
      const user = await this.authService.verifyToken(token);
      request.user = user; // opcional, salva infos do usuário na requisição
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
