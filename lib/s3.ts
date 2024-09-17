// lib/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFileToS3 = async (
  file: Buffer,
  filename: string,
  userId: number
) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userId}/${filename}`,
    Body: file,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${userId}/${filename}`;
};

// https://ensiletadrawings.s3.ap-south-1.amazonaws.com/2dview-dummy.pdf
