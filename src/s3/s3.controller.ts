import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

@Controller('files')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const folder = 'uploads'; // Nome da pasta no bucket
    return await this.s3Service.uploadFile(file, folder);
  }

  @Get(':folder/:key')
  async getImage(@Param('folder') folder: string, @Param('key') key: string) {
    const url = await this.s3Service.getSignedUrl(folder, key);
    return { url };
  }
}
