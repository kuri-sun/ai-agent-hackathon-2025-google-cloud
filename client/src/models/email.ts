export type Email = {
  id?: string;
  from: string;
  subject: string;
  body: string;
  sanitized?: string;
  timestamp: number;
};
