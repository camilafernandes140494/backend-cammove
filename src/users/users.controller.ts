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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UpdateUser } from './user.types'; // Importando o tipo User e UpdateUserDto
import { PermissionType } from 'src/permission/permission.types';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Rota para salvar usuário no Firestore
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Param('id') id: string, @Body() body: User) {
    // Adicionando a data de criação automaticamente
    const createdAt = new Date().toISOString(); // Data de criação no formato ISO 8601
    const updatedAt = '';
    const deletedAt = '';

    const { name, gender, birthDate, permission } = body;

    return this.usersService.createUser(id, {
      name,
      gender,
      birthDate,
      permission,
      createdAt,
      updatedAt,
      deletedAt,
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
      const { name, gender, birthDate, permission } = body;
      const updateData = {
        ...(name && { name }),
        ...(gender && { gender }),
        ...(birthDate && { birthDate }),
        ...(permission && { permission }),
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
    @Query('gender') gender?: string,
    @Query('deletedAt') deletedAt?: string,
    @Query('permission') permission?: PermissionType,
  ): Promise<User[]> {
    try {
      const filters = { name, gender, deletedAt, permission };
      return await this.usersService.getUsers(filters);
    } catch (error) {
      console.error('Erro ao buscar usuários: ', error);
      throw error;
    }
  }
}
