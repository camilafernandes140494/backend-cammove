import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'; // Importe o SDK do Gemini
import { WorkoutSuggestionData } from './gemini.types';
import { ExercisesService } from 'src/exercises/exercises.service';
import { Exercise } from 'src/exercises/exercises.types';

@Injectable()
export class GeminiService { // Renomeado para GeminiService para clareza
  private gemini: GenerativeModel;

  constructor(  private readonly exercisesService: ExercisesService,) {
    const apiKey = process.env.GEMINI_API_KEY; // Use uma variável de ambiente para a chave Gemini

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não está configurada no ambiente.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Você pode especificar o modelo aqui, por exemplo, 'gemini-pro' ou 'gemini-1.5-flash'
    this.gemini = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' });
  }

  async workoutSuggestion({ type, age, gender, nameWorkout }: WorkoutSuggestionData): Promise<{}> {
      const availableExercises: Exercise[] = await this.exercisesService.getExercises({}); 

    const prompt = `
Crie um treino de musculação para um aluno com as seguintes características:

- Idade: ${age} anos
- Sexo: ${gender}
- Objetivo: ${type}
- Nome de treino: ${nameWorkout}

O treino deve ser retornado no formato JSON e conter um array de exercícios, onde cada item possui:
O treino deve ser **composto APENAS por exercícios da seguinte lista de exercícios disponíveis**:

${availableExercises}
O treino deve ser retornado no formato JSON e conter um array de exercícios, onde cada item possui:

- "exerciseId": o objeto do exercício  (deve corresponder exatamente ao lista fornecida)
- "sets": número de séries
- "repetitions": número de repetições por série
- "restTime": tempo de descanso entre as séries (em segundos)


Exemplo de formato esperado:

[
  {
    "exerciseId":      {
        "name": "polichinelo ",
        "createdAt": "2025-02-26T00:22:22.764Z",
        "deletedAt": "",
        "id": "KWVMhuzwe0IWlqtY7Ctd",
        "muscleGroup": [
          "Ombros",
          "Peito"
        ],
        "description": "Pula pula",
        "categoryData": {
          "label": "Musculação",
          "value": "Musculação"
        },
        "category": "Musculação",
        "images": [
          "https://app-cammove-images.s3.us-east-2.amazonaws.com/exercises/1745952217836-327E342C-B8EA-4DA0-83D3-C14CBFFECADC.webp",
          "https://app-cammove-images.s3.us-east-2.amazonaws.com/exercises/1745952246401-IMG_7897.webp",
          "https://app-cammove-images.s3.us-east-2.amazonaws.com/exercises/1745952251438-IMG_7901.webp",
          "https://app-cammove-images.s3.us-east-2.amazonaws.com/exercises/1745952256299-IMG_7904.webp",
          "https://app-cammove-images.s3.us-east-2.amazonaws.com/exercises/1745952260798-IMG_7898.webp",
          "https://app-cammove-images.s3.us-east-2.amazonaws.com/exercises/1745952265816-IMG_7899.webp"
        ],
        "updatedAt": "2025-04-29T19:00:34.075Z"
      },,
    "sets": 4,
    "repetitions": 12,
    "restTime": 60
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

      return {exercises:availableExercises,response:response,  workout: result}
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