import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // usa memória, não cria arquivos temporários
      limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description: string },
  ) {
    if (!file) {
      throw new Error('Arquivo não enviado.');
    }

    const videoUrl = await this.youtubeService.uploadVideoBuffer(
      file.buffer,
      body.title,
      body.description,
    );

    return { videoUrl };
  }
}
