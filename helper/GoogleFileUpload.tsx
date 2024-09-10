import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import prisma from '@/prisma/db';




export const uploadFileToDrive = async (filePath: string, fileName: string) => {
    // Google Drive authentication
    const oAuth2Client = new google.auth.OAuth2(
        process.env.NEXTAUTH_GOOGLE_CLIENT_ID,
        process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET,
        // process.env.GOOGLE_REDIRECT_URI
    );

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    try {
        const fileMetadata = {
            name: fileName,
        };

        const media = {
            mimeType: 'application/pdf',
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name, webViewLink',
        });

        return response.data; // Return the Google Drive file info
    } catch (error: any) {
        throw new Error('Error uploading file to Google Drive: ' + error.message);
    }
};

export const uploadFileAndStoreMetadata = async (
    filePath: string,
    fileName: string
) => {
    try {
        const fileData = await uploadFileToDrive(filePath, fileName);

        if (!fileData.name || !fileData.webViewLink) {
            throw new Error('Invalid file data: Missing file name or webViewLink');
        }

        const newFile = await prisma.view2D.create({
            data: {
                fileName: fileData.name,
                fileURL: fileData.webViewLink,
            },
        });

        return newFile;
    } catch (error: any) {
        throw new Error('Error uploading and storing file: ' + error.message);
    }
};
