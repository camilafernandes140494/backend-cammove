import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    if (!file) {
      throw new HttpException('Nenhum arquivo enviado', HttpStatus.BAD_REQUEST);
    }

    const bucketName = 'meu-bucket'; // Nome do bucket no Supabase
    const filePath = `${folder}/${Date.now()}-${file.originalname}`; // Caminho do arquivo no bucket

    try {
      // Faz o upload do arquivo
      const { error } = await this.supabaseService.uploadFile(
        bucketName,
        filePath,
        file.buffer,
        file.mimetype,
      );

      // Caso ocorra um erro no upload
      if (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      // Obtém a URL pública do arquivo
      const publicUrl = await this.supabaseService.getPublicUrl(
        bucketName,
        filePath,
      );

      return { url: publicUrl }; // Retorna a URL pública
    } catch (error) {
      throw new HttpException(
        'Erro ao fazer upload do arquivo',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
}
