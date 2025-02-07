import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
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
    if (!file) throw new Error('Nenhum arquivo enviado');

    const bucketName = 'meu-bucket'; // Nome do bucket no Supabase
    const filePath = `${folder}/${Date.now()}-${file.originalname}`; // Caminho do arquivo no bucket

    // Faz o upload usando o método público
    const { error } = await this.supabaseService.uploadFile(
      bucketName,
      filePath,
      file.buffer,
      file.mimetype,
    );

    if (error) throw new Error(error.message);

    // Obtém a URL pública do arquivo
    const publicUrl = await this.supabaseService.getPublicUrl(
      bucketName,
      filePath,
    );

    return { url: publicUrl };
  }
}
