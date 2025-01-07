export type Exercise = {
  name: string;
  description: string;
  type: string; // Ex: "Cardio", "Strength", etc.
  images: string[]; // Array de URLs de imagens
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
