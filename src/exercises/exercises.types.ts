export type Exercise = {
  name: string;
  description: string;
  category: string;
  muscleGroup: string[];
  images: string[];
  video?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  id?: string;
};

export type UpdateExercise = Partial<Exercise>;
