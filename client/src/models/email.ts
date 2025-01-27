export type Email = {
  from: string;
  subject: string;
  body: string;
  sanitized?: string;
  timestamp: number;
};
