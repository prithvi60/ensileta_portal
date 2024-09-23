import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { NextResponse } from 'next/server';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// POST method to upload file to S3
export async function POST(req: Request) {
  try {
    // Check if the request content type is 'multipart/form-data'
    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid Content-Type' }, { status: 400 });
    }

    // Parse the form data from the request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userName = formData.get('userName') as string;
    const filename = formData.get('filename') as string;

    // Check if required fields are present
    if (!file || !filename || !userName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a readable stream from the file
    const stream = file.stream();

    // Prepare S3 upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${userName}/${filename}`,
      Body: stream,
      ContentType: file.type,
    };

    // Use Upload from @aws-sdk/lib-storage to handle the upload
    const uploader = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    // Upload the file
    await uploader.done();

    // Generate the S3 file URL after a successful upload
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${userName}/${filename}`;

    // Return the uploaded file's URL as the response
    return NextResponse.json({ fileUrl });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
