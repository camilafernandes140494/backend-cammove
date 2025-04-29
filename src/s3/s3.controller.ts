import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

@Controller('files')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post(':folder/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('folder') folder: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.s3Service.uploadFile(file, folder);
  }

  @Get(':folder/:key')
  async getImage(@Param('folder') folder: string, @Param('key') key: string) {
    const url = await this.s3Service.getPublicUrl(folder, key);
    return { url };
  }

  @Delete(':folder/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(
    @Param('folder') folder: string,
    @Param('key') key: string,
  ) {
    await this.s3Service.deleteFile(folder, key);
    // 204 No Content não retorna body
  }

  @Post(':folder/upload/video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
  ) {
    return this.s3Service.uploadVideo(file, folder || 'videos');
  }
}
