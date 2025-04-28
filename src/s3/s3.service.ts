import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = process.env.AWS_BUCKET_NAME;
  }

  async uploadFile(file: Express.Multer.File) {
    const convertedBuffer = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    const newFileName = `${Date.now()}-${file.originalname.split('.')[0]}.webp`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: newFileName,
      Body: convertedBuffer,
      ContentType: 'image/webp',
    };

    await this.s3.send(new PutObjectCommand(uploadParams));
    return { key: newFileName };
  }

  async getSignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return url;
  }
}
