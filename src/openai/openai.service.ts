import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { WorkoutSuggestionData } from './openai.types';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
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
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Resposta vazia da OpenAI');
      }

      return content;
    } catch (error) {
      console.error('Erro ao gerar treino com IA:', error);
      throw new InternalServerErrorException('Erro ao gerar treino com inteligência artificial');
    }
  }
}
