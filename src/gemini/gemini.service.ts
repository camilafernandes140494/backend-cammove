import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'; // Importe o SDK do Gemini
import { WorkoutSuggestionData } from './gemini.types';

@Injectable()
export class GeminiService { // Renomeado para GeminiService para clareza
  private gemini: GenerativeModel;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY; // Use uma variável de ambiente para a chave Gemini

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não está configurada no ambiente.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Você pode especificar o modelo aqui, por exemplo, 'gemini-pro' ou 'gemini-1.5-flash'
    this.gemini = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' });
  }

  async workoutSuggestion({ type, age, gender }: WorkoutSuggestionData): Promise<string> {
    const prompt = `
Crie um treino de musculação para um aluno com as seguintes características:

- Idade: ${age} anos
- Sexo: ${gender}
- Objetivo: ${type}

O treino deve ser retornado no formato JSON e conter um array de exercícios, onde cada item possui:

- "nome": nome do exercício
- "series": número de séries
- "repeticoes": número de repetições por série
- "descanso": tempo de descanso entre as séries (em segundos)

Exemplo de formato esperado:

[
  {
    "nome": "Agachamento livre",
    "series": 4,
    "repeticoes": 12,
    "descanso": 60
  },
  {
    "nome": "Supino reto com barra",
    "series": 3,
    "repeticoes": 10,
    "descanso": 90
  }
]

Não adicione explicações ou texto fora do JSON.
    `.trim();

    try {
      // Para Gemini, você usa o método `generateContent` para enviar o prompt.
      const result = await this.gemini.generateContent(prompt);
      const response = await result.response;
      const content = response.text().trim();


      if (!content) {
        throw new Error('Resposta vazia do Gemini.');
      }

      return content
      // O Gemini geralmente é bom em retornar o JSON puro se solicitado.
      // No entanto, é uma boa prática tentar parsear para garantir que é JSON válido.
      // Se a resposta não for um JSON válido, você pode querer adicionar uma lógica para tratar isso.
   

    } catch (error) {
      console.error('Erro ao gerar treino com Gemini:', error);
      // Você pode verificar o tipo de erro para dar uma mensagem mais específica
      if (error.response && error.response.status) {
        throw new InternalServerErrorException(`Erro na API Gemini: ${error.response.status} - ${error.response.statusText}`);
      }
      throw new InternalServerErrorException('Erro ao gerar treino com inteligência artificial.');
    }
  }
}