// Definindo o tipo para a avaliação física
type BodyMeasurements = {
  weight: string;
  height: string;
  bodyFatPercentage: string;
  imc: string;
  waistCircumference: string;
  hipCircumference: string;
  chestCircumference: string;
  rightArmCircumference: string;
  leftArmCircumference: string;
  rightThighCircumference: string;
  leftThighCircumference: string;
  rightCalfCircumference: string;
  leftCalfCircumference: string;
  neckCircumference: string;
};

type BodyMass = {
  muscleMass: string;
  boneMass: string;
};

type PhysicalTests = {
  pushUpTest: string;
  squatTest: string;
  flexibilityTest: string;
  cooperTestDistance: string;
};

type HeartRate = {
  restingHeartRate: string;
  maxHeartRate: string;
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
  studentName: string;
  studentId: string;

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

  observations: string;
  // Data da avaliação
  assessmentDate: string;
};
