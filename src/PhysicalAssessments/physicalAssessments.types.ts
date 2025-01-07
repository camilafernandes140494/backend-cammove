// Definindo o tipo para a avaliação física
type BodyMeasurements = {
  weight: number;
  height: number;
  bodyFatPercentage: number;
  imc: number;
  waistCircumference: number;
  hipCircumference: number;
  chestCircumference: number;
  rightArmCircumference: number;
  leftArmCircumference: number;
  rightThighCircumference: number;
  leftThighCircumference: number;
  rightCalfCircumference: number;
  leftCalfCircumference: number;
  neckCircumference: number;
};

type BodyMass = {
  muscleMass: number;
  boneMass: number;
};

type PhysicalTests = {
  pushUpTest: number;
  squatTest: number;
  flexibilityTest: number;
  cooperTestDistance: number;
};

type HeartRate = {
  restingHeartRate: number;
  maxHeartRate: number;
};

type BalanceAndMobility = {
  balanceTest: string;
  mobilityTest: string;
};

type Posture = {
  postureAssessment: string;
};

type MedicalHistory = {
  injuryHistory: string;
  medicalConditions: string;
  chronicPain: string;
};

export type PhysicalAssessmentData = {
  // Medições Corporais
  bodyMeasurements: BodyMeasurements;

  // Massa Corporal
  bodyMass: BodyMass;

  // Testes Físicos
  physicalTests: PhysicalTests;

  // Frequência Cardíaca
  heartRate: HeartRate;

  // Avaliações de Equilíbrio e Mobilidade
  balanceAndMobility: BalanceAndMobility;

  // Postura
  posture: Posture;

  // Histórico de Lesões e Condições Médicas
  medicalHistory: MedicalHistory;

  // Objetivos de Fitness
  fitnessGoals: string;

  // Data da avaliação
  assessmentDate: string;
};
