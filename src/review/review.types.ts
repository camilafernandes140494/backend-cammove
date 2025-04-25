export type studentReviewData = {
  studentId: string;
  name: string;
};

export type ReviewData = {
  teacherId: string;
  student: studentReviewData;
  workoutId: string;
  review: string;
  reviewNote: string;
  reviewDescription: string;
  reviewFeedback: string;
  createdAt: string;
  updateAt: string;
};
