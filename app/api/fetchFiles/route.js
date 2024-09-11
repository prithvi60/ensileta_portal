import { google } from 'googleapis';
import dotenv from 'dotenv';
export async function GET() {
    // console.log('Fetching files from Google Drive...');

// Load environment variables from .env file
dotenv.config();

    const key = {
        "type": "service_account",
        "project_id": process.env.GOOGLE_PROJECT_ID,
        "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
        "private_key": process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines
        "client_email": process.env.GOOGLE_CLIENT_EMAIL,
        "client_id": process.env.GOOGLE_CLIENT_ID,
        "auth_uri": process.env.GOOGLE_AUTH_URI,
        "token_uri": process.env.GOOGLE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
        "client_x509_cert_url": process.env.GOOGLE_CLIENT_CERT_URL,
        "universe_domain": process.env.GOOGLE_UNIVERSE_DOMAIN
    };

    // Create a JWT client
    const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ['https://www.googleapis.com/auth/drive.readonly'],
    );

    try {
        await jwtClient.authorize();
        const drive = google.drive({ version: 'v3', auth: jwtClient });
        const response = await drive.files.list({
            q: "trashed = false",
            fields: 'files(id, name)',
        });
        const files = response.data.files;

        return new Response(JSON.stringify(files), { status: 200 });
    } catch (error) {
        console.error('Error fetching files:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch files' }), { status: 500 });
    }
}