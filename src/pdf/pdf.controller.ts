// src/pdf/pdf.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PdfService } from './pdf.service';

export class GeneratePdfDto {
  body: string;
  student: {
    name: string;
    gender: string;
    age: string;
  };
}

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdf(@Body() generatePdfDto: GeneratePdfDto) {
    try {
      const base64 = await this.pdfService.generatePdfBase64(
        generatePdfDto.body,
        generatePdfDto.student,
      );
      return { base64 };
    } catch (error) {
      throw new HttpException(
        'Erro ao gerar PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}