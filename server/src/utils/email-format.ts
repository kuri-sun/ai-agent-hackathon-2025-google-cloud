import mailParser from "mailparser";
import MailComposer from "nodemailer/lib/mail-composer";
import Mail from "nodemailer/lib/mailer";

// Parse raw email(MIME format) to get email content.
export const parseRawEmail = async (raw: string | null | undefined) => {
  const parsed = await mailParser.simpleParser(
    Buffer.from(raw || "", "base64")
  );

  // Don't send the file content in the response.
  if (parsed.attachments) {
    parsed.attachments.forEach((attachment) => {
      attachment.content = Buffer.from("", "base64");
    });
  }

  return parsed;
};

export const composeRawEmail = async ({
  from,
  to,
  subject,
  text,
  inReplyTo,
  references,
}: Mail.Options) => {
  const mail = new MailComposer({
    from,
    to,
    subject,
    text,
    references,
    inReplyTo,
  });
  const stream = mail.compile().createReadStream();

  return new Promise<string>((resolve, reject) => {
    let rawEmail = "";
    stream.on("data", (chunk) => {
      rawEmail += chunk;
    });
    stream.on("end", () => {
      // *** KEY CHANGE: Base64 encode the raw email ***
      const b64EncodedEmail = Buffer.from(rawEmail).toString("base64");
      resolve(b64EncodedEmail);
    });
    stream.on("error", (err) => {
      console.error("Error composing email:", err);
      reject(err);
    });
  });
};
