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

  async uploadFile(file: Express.Multer.File, folder: string) {
    const convertedBuffer = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    const newFileName = `${Date.now()}-${file.originalname.split('.')[0]}.webp`;
    const fileKey = `${folder}/${newFileName}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: convertedBuffer,
      ContentType: 'image/webp',
    };

    await this.s3.send(new PutObjectCommand(uploadParams));

    // Aqui já gera a URL assinada
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    // Retorna tanto a chave quanto a URL
    return { key: fileKey, url };
  }

  async getSignedUrl(folder: string, key: string) {
    const fileKey = `${folder}/${key}`; // A chave com a pasta

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return url;
  }
}
