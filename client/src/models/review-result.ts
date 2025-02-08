export type ReviewResult = {
  _id: string;
  draftId: string;
  reviews: Review[];
};

export type Review = {
  level: "danger" | "warning" | "info";
  confidence: number;
  comment: string;
};
