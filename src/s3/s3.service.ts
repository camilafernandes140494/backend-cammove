import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';

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

    // Faz o upload do arquivo para o S3
    await this.s3.send(new PutObjectCommand(uploadParams));

    // Gerar a URL pública (sem assinatura)
    const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    // Retorna a chave do arquivo e a URL pública
    return { key: fileKey, url };
  }

  // Caso precise de uma função para obter a URL pública diretamente (sem assinatura)
  async getPublicUrl(folder: string, key: string) {
    const fileKey = `${folder}/${key}`;

    // Retorna a URL pública do arquivo
    const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    return url;
  }

  async deleteFile(folder: string, key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: `${folder}/${key}`,
      }),
    );

    return { message: 'Arquivo deletado com sucesso.', key };
  }
}
