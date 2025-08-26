import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // "file" é o nome do campo no form-data
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description: string },
  ) {
    const videoUrl = await this.youtubeService.uploadVideo(
      file.path, // caminho temporário
      body.title,
      body.description,
    );

    return { videoUrl };
  }
}
