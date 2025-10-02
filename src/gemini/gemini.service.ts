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

  async workoutSuggestion({ type, age, gender, nameWorkout, level, muscleGroup,amountExercises }: WorkoutSuggestionData): Promise<{}> {

    
const prompt = `
Você é um especialista em educação física.

Crie um treino de musculação com base nas seguintes informações:
- Idade: ${age}
- Sexo: ${gender}
- Objetivo: ${type}
- Nome do treino: ${nameWorkout}
- Nível: ${level}
- Grupos musculares: ${Array.isArray(muscleGroup) ? muscleGroup.join(', ') : muscleGroup ? String(muscleGroup) : ''}
- Quantidade de exercícios: ${amountExercises}

Regras:
- Os exercícios devem ser compatíveis com academia ou peso corporal.
- Adequados ao nível do aluno.
- Use linguagem objetiva.
- Retorne apenas um array JSON puro, sem texto adicional, introdução ou explicação.

Formato da resposta:
[
  {
    "name": "nome do exercício, sem colocar o nome do exercício em inglês entre parênteses. somente o básico",
    "sets": número de séries (ex: 3),
    "repetitions": número de repetições por série (ex: 12),
    "category": ["Peito"],
    "restTime": tempo de descanso entre as séries, em segundos (ex: 60),
   }
]
`.trim();


try {
  const result = await this.gemini.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  // Extrair o primeiro array JSON completo da resposta
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');

  if (firstBracket === -1 || lastBracket === -1) {
    console.warn('JSON não encontrado na resposta, retornando texto bruto');
    return { rawText: text };
  }

  const jsonText = text.slice(firstBracket, lastBracket + 1);

  let exercises;
  try {
    exercises = JSON.parse(jsonText);
  } catch (parseError) {
    console.warn('Erro ao fazer parse do JSON, retornando texto bruto:', parseError);
    return { rawText: text };
  }

  // Validação simples e ajuste no campo category para garantir que seja array
  exercises = exercises.map((ex: any) => {
  ex.category = Array.isArray(ex.category)
    ? ex.category
    : typeof ex.category === 'string'
      ? [ex.category]
      : [];
    ex.sets = ex.sets || '0';
    ex.repetitions = ex.repetitions || '0';
    ex.restTime = ex.restTime || '0';
    return ex;
  });

  return { exercises };
} catch (err) {
  console.error('Erro ao chamar Gemini:', err);
  throw new InternalServerErrorException('Erro ao se comunicar com Gemini');
}


  }}