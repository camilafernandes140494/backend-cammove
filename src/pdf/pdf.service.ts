// src/pdf/pdf.service.ts
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

interface Student {
  name: string;
  gender: string;
  age: string;
}

@Injectable()
export class PdfService {
  async generatePdfBase64(body: string, student: Student): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          const base64 = pdfBuffer.toString('base64');
          resolve(base64);
        });

        doc.on('error', (error) => {
          reject(error);
        });

        // Título
        doc
          .fontSize(18)
          .font('Helvetica-Bold')
          .text('Avaliação Física', { align: 'center' });

        doc.moveDown(1);

        // Informações do aluno
        doc
          .fontSize(12)
          .font('Helvetica')
          .text(`Aluno(a): ${student.name}`, { align: 'left' });

        doc
          .fontSize(12)
          .text(`Gênero: ${student.gender} | ${student.age}`, { align: 'left' });

        doc.moveDown(1);

        // Corpo do relatório
        doc.fontSize(10).font('Helvetica').text(body, {
          align: 'left',
          lineGap: 2,
        });

        // Rodapé
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);

          doc
            .fontSize(9)
            .text(
              `Desenvolvido por Cammove - Página ${i + 1} de ${pageCount}`,
              50,
              doc.page.height - 50,
              {
                align: 'center',
              },
            );
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}