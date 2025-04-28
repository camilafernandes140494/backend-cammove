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
    return await this.s3Service.uploadFile(file);
  }

  @Get(':key')
  async getImage(@Param('key') key: string) {
    const url = await this.s3Service.getSignedUrl(key);
    return { url };
  }
}
