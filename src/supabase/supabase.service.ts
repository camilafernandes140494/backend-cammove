import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  // Criando um método público para acessar o Supabase Storage
  async uploadFile(
    bucket: string,
    filePath: string,
    fileBuffer: Buffer,
    contentType: string,
  ) {
    return this.supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, { contentType });
  }

  async getPublicUrl(bucket: string, filePath: string) {
    return this.supabase.storage.from(bucket).getPublicUrl(filePath).data
      .publicUrl;
  }
}
