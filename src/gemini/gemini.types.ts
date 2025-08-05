export type WorkoutSuggestionData = {
  age:string;
  gender:string;
  type: string;
  nameWorkout: string;
  level: string; // Nível do aluno (iniciantes, intermediários, avançados)
  muscleGroup: string[] ; 
  amountExercises: number
};
