import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFileToS3 = async (
  file: Blob,
  filename: string,
  userName: string
) => {
  const uploadParams = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: `${userName}/${filename}`,
    Body: file,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);

  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${userName}/${filename}`;
};

// https://ensiletadrawings.s3.ap-south-1.amazonaws.com/2dview-dummy.pdf

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export const uploadFileToS3 = async (
//   file: Buffer,
//   filename: string,
//   userId: number
//   // mimetype: any
// ) => {
//   const uploadParams = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `${userId}/${filename}`,
//     Body: file,
//     // ContentType: mimetype,
//   };

//   const command = new PutObjectCommand(uploadParams);
//   await s3.send(command);

//   return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${userId}/${filename}`;
// };

// // https://ensiletadrawings.s3.ap-south-1.amazonaws.com/2dview-dummy.pdf
