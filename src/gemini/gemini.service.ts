import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'; // Importe o SDK do Gemini
import { WorkoutSuggestionData } from './gemini.types';
import { ExercisesService } from 'src/exercises/exercises.service';

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
    // let availableExercises: Pick<Exercise, 'id' | 'name' | 'category' | 'description'| 'muscleGroup'>[] = []
    // try{
    //   await this.exercisesService.getExercises({}); 

    //     const simplifiedExercises = availableExercises.map((ex) => ({
    //     id: ex.id,
    //     name: ex.name,
    //     muscleGroup: ex.muscleGroup,
    //     category: ex.category,
    //     description: ex.description
    //   }));

    //   availableExercises = simplifiedExercises 
    // }
    // catch{
    //   availableExercises = []
    // }

    
    const prompt = `
Crie um treino de musculação para um aluno com as seguintes características:

- Idade: ${age} anos
- Sexo: ${gender}
- Objetivo: ${type}
- Nome de treino: ${nameWorkout}



O treino deve ser retornado no formato JSON e conter um array de exercícios, onde cada item possui:

- "name": nome do exercicio
- "sets": número de séries
- "repetitions": número de repetições por série
- "restTime": tempo de descanso entre as séries (em segundos)


Exemplo de formato esperado:

[
  {
    "name": "polichinelo ",
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




      // let workoutData;
      // try {
      //   workoutData = JSON.parse(content);
      // } catch (e) {
      //   throw new InternalServerErrorException('Resposta da IA não está em formato JSON válido.');
      // }

      return {
        result: result,
        response: response,
        exercises: [],
        // workout: workoutData
      };

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