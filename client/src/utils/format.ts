import { marked } from "marked";
import DOMPurify from "dompurify";

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

export const delay = () => new Promise((resolve) => setTimeout(resolve, 3000));

export const getSafeHtml = async (body: string) => {
  const markdownHtml = await marked(body);
  const sanitizedHtml = DOMPurify.sanitize(markdownHtml);
  return sanitizedHtml;
};
