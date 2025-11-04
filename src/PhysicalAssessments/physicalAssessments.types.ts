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

type PhysicalActivityHistory = {
  currentlyActive: string;      
  activities: string;           
  frequency: string;            
};


// 🆕 Hábitos de vida
type Lifestyle = {
  smoking: string;                  
  alcoholConsumption: string;       
  sleepQuality: string;            
  stressLevel: string;           
};

type Nutrition = {
  hasNutritionFollowUp: string;    
  mealsPerDay: string;
  foodQuality: string;            
  dietaryRestrictions: string;     
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

    // Histórico de Atividade Física
  PhysicalActivityHistory: PhysicalActivityHistory;

  // Hábitos de Vida
  Lifestyle:Lifestyle;

    // 🆕 Nutrição
  Nutrition: Nutrition;
};
