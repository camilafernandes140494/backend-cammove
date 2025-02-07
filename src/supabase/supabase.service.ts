import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY.replace(/\\n/g, '\n'),
    );
  }

  // Método para fazer o upload do arquivo no Supabase Storage
  async uploadFile(
    bucket: string,
    filePath: string,
    fileBuffer: Buffer,
    contentType: string,
  ) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, { contentType });

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return data;
  }

  // Método para obter a URL pública do arquivo no bucket
  async getPublicUrl(bucket: string, filePath: string) {
    const { data } = await this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    return data.publicUrl;
  }
}
