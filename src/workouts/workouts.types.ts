type Exercise = {
  exerciseId: string;
  repetitions: number;
  sets: number;
  restTime: string;
  observations: string;
};
export type WorkoutData = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  exercises: Exercise[];
};
