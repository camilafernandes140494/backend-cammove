export type Exercise = {
  name: string;
  description: string;
  category: string;
  muscleGroup: string[];
  images: string[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type UpdateExercise = Partial<Exercise>;
