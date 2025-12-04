import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Get,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UpdateUser } from './user.types'; // Importando o tipo User e UpdateUserDto
import { PermissionType } from 'src/permission/permission.types';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
// import * as bcrypt from 'bcrypt';

@UseGuards(AuthGuard)
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //pensando se posso adicionar admin
  // private readonly adminPasswordHash =
  //   '$2b$10$EIXhM58zXKHgYu5TtW5AOe9Bs12YfiXLzFIS4RHTwW9eRtqk9Jhuy';

  // // Rota para validar a senha de admin
  // @Post('validate-password')
  // @HttpCode(HttpStatus.OK)
  // async validatePassword(
  //   @Body('password') password: string,
  // ): Promise<{ valid: boolean }> {
  //   try {
  //     const isValid = await bcrypt.compare(password, this.adminPasswordHash);
  //     return { valid: isValid };
  //   } catch (error) {
  //     console.error('Erro ao validar senha:', error);
  //     throw error;
  //   }
  // }

  // Rota para salvar usuário no Firestore
  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Param('id') id: string, @Body() body: User) {
    // Adicionando a data de criação automaticamente
    const createdAt = new Date().toISOString(); // Data de criação no formato ISO 8601
    const updatedAt = '';
    const deletedAt = '';

    const {
      name,
      gender,
      birthDate,
      permission,
      image,
      email,
      phone,
      status = 'ACTIVE',
      authProvider
    } = body;

    return this.usersService.createUser(id, {
      name,
      gender,
      birthDate,
      image,
      email,
      permission,
      createdAt,
      updatedAt,
      deletedAt,
      status,
      phone,
      authProvider,
    });
  }

  // Rota para atualizar usuário no Firestore
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string, // Recebe o id como parâmetro da URL
    @Body() body: UpdateUser, // Usando o tipo UpdateUserDto
  ) {
    try {
      // Adicionando 'updatedAt' com a data da atualização
      const updatedAt = new Date().toISOString();

      // Certifique-se de não enviar campos undefined
      const { name, gender, birthDate, permission, image, status, phone, termsOfUse } =
        body;
      const updateData = {
        ...(name && { name }),
        ...(gender && { gender }),
        ...(birthDate && { birthDate }),
        ...(permission && { permission }),
        ...(image && { image }),
        ...(status && { status }),
        ...(phone && { phone }),
        ...(termsOfUse && { termsOfUse }),
        updatedAt,
      };

      return await this.usersService.updateUser(id, updateData);
    } catch (error) {
      console.error('Erro ao processar atualização: ', error);
      throw error;
    }
  }

  @Patch(':id/delete')
  @HttpCode(HttpStatus.OK)
  async softDeleteUser(@Param('id') id: string) {
    return this.usersService.softDeleteUser(id);
  }

   @Post(':id/device-token')
  async saveDeviceToken(
    @Param('id') id: string,
    @Body('deviceToken') deviceToken: string
  ) {
    return this.usersService.saveDeviceToken(id, deviceToken);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restoreUser(@Param('id') id: string) {
    try {
      return await this.usersService.restoreUser(id);
    } catch (error) {
      console.error('Erro ao restaurar usuário: ', error);
      throw error;
    }
  }


  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
  @Query('teacherId') teacherId?: string, 
  ) {
    return this.usersService.deleteUser(id, teacherId);
  }


  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.getUserById(id);
    } catch (error) {
      console.error('Erro ao buscar usuário: ', error);
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('gender') gender?: string,
    @Query('deletedAt') deletedAt?: string,
    @Query('permission') permission?: PermissionType,
  ): Promise<User[]> {
    try {
      const filters = { name, gender, deletedAt, permission, email };
      return await this.usersService.getUsers(filters);
    } catch (error) {
      console.error('Erro ao buscar usuários: ', error);
      throw error;
    }
  }


}
