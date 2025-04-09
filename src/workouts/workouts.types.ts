import { Exercise } from 'src/exercises/exercises.types';

type ExerciseWorkout = {
  exerciseId: Exercise;
  repetitions: number;
  sets: number;
  restTime: string;
  observations: string;
};
export type WorkoutData = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  exercises: ExerciseWorkout[];
  type: string;
  studentName: string;
  studentId: string;
  nameWorkout: string;
};
