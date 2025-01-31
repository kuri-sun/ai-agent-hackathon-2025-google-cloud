export type ReviewResults = {
  id?: string;
  reviews: ReviewResult[];
};

export type ReviewResult = {
  level: "danger" | "warning" | "info";
  confidence: number;
  comment: string;
};
