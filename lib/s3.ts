import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFileToS3 = async (
  file: Blob,
  filename: string,
  userName: string
) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userName}/${filename}`,
    Body: file,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${userName}/${filename}`;
};

// const s3Client = new S3Client({
//   region: process.env.NEXT_PUBLIC_AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export const uploadFileToS3 = async (
//   file: Blob,
//   filename: string,
//   userName: string
// ) => {
//   const uploadParams = {
//     Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
//     Key: `${userName}/${filename}`,
//     Body: file,
//   };

//   const command = new PutObjectCommand(uploadParams);
//   await s3Client.send(command);

//   return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${userName}/${filename}`;
// };
