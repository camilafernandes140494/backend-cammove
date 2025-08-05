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

Gere um treino de musculação personalizado para um aluno com as seguintes características:
- Idade: ${age}
- Sexo: ${gender}
- Objetivo: ${type}
- Nome do treino: ${nameWorkout}
- Nível de experiência: ${level}
- Grupos musculares: ${muscleGroup.join(', ')}
- Quantidade de exercícios: ${amountExercises}

Regras:
- O treino deve ser adequado ao nível do aluno.
- Deve conter apenas exercícios compatíveis com academia ou treinos com peso corporal.
- Use linguagem clara e objetiva.

Formato de resposta:
Retorne **apenas um array JSON** com os exercícios, sem explicações extras.
Não adicione explicações, introduções ou conclusões. Responda apenas com o array JSON diretamente, sem markdown ou texto adicional.

Cada item do array deve seguir a estrutura:
[
  {
    "name": "nome do exercício",
    "sets": número de séries (ex: 3),
    "repetitions": número de repetições por série (ex: 12),
    "category": Grupo muscular principal trabalhado nesse exercício (ex: Peito, bíceps),
    "restTime": tempo de descanso entre as séries, em segundos (ex: 60),
  }
]
`.trim();

try {
  const result = await this.gemini.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  // Tenta extrair o JSON de dentro do texto
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
  } catch (parseErr) {
    console.warn('Erro ao fazer parse do JSON, retornando texto bruto:', parseErr);
    return { rawText: text };
  }

  return { exercises };
} catch (err) {
  console.error('Erro ao chamar Gemini:', err);
  throw new InternalServerErrorException('Erro ao se comunicar com Gemini');
}


  }}