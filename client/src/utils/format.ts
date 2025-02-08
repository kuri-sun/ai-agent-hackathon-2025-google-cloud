import { marked } from "marked";
import DOMPurify from "dompurify";
import i18n from "../i18/config";
import dayjs from "dayjs";

export const formatDate = (date: string) => {
  const dateFormat =
    i18n.language === "ja" ? "YYYY年MM月DD日 HH:mm" : "MM/DD/YYYY HH:mm";
  return dayjs(date).format(dateFormat);
};

export const delay = () => new Promise((resolve) => setTimeout(resolve, 3000));

export const getSafeHtml = async (body: string) => {
  const markdownHtml = await marked(body);
  const sanitizedHtml = DOMPurify.sanitize(markdownHtml);
  return sanitizedHtml;
};
