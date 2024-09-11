import { google } from 'googleapis';

export async function GET() {
    // console.log('Fetching files from Google Drive...');

    // Use the JSON directly and hide keys
    const key = {
        "type": "service_account",
        "project_id": "ensileta-files",
        "private_key_id": "aa46bc73a3d6b586ff280de3cfdc6fc1c230913b",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCCnLhtWNP4/y63\nWunxKxkYejvZMlC4fdbqlr/Q01s6Iv2StWSkAF2Eo2A+hWG9gCqAuCv0rKN/td+o\nlYDHxP+D7Zc56XeOL2sBc+TyJ1opCBwF88IuYmdHuD+ugblFh0gaC1LXKdg8TZCW\nwSi1H7Ft0HGUFcJUg0kAoyh7wystfKVMZwUTbcDWsdCN7sAtrmPKD7eUFm/bqkxC\n48cxPaFB7VJ/nW2d29DucPJIbYRkeXPI5LuJbc4R4yTcqzZ5jjkrVHjVsOqfyNuw\nSueGDw+dBJp9RkLU43iqgw/OB6wUlgDJpohyp4SU95nbEE64k9+DRLqCucNk+943\n2HmNyu35AgMBAAECggEABzDqPYj5uLiSAaHVhgPtsImQUHvC8nlpMwbEPlLYr7l7\n9Q8cIKRtga8+Dgspb7XGAUrCjsjPgqlIjF9Y1QbdW43h+NwIC1HEhjKzjPqKLf6m\njlRWoVelII9+IBU/1lplp5tufu6sm1tY5dfyLhC149opWrIc/iqxQwH4qWG8N5eU\nXpvLLDxCt5sTRW4iKNmea1xhenJg7wAeIhkZ805rByvV6u0IRcae5bPwAb0tPL0m\nVT1H/8IolnwURln9wOp/eXpp6d9LQXT4HFmdrr50jchkeIlo8bqRRjUR2Xn7P1hv\nOl8KcYaXtccox3G5MS/ZMGgLor8e2UYifCx6ew2A4QKBgQC3Jenv84BpAz2NWNRP\nWDxIzStXcMsltZsp37HIRqLvnVwZvosp6mhsXC2VcPpOdAVE+E/RsAT2ic3vWIm7\nQqijy9lPuvlRPyMmxoCdLAOgCwx43rXNCMI4zxr4LTLGz3MsaVddIaopsAd+h3P3\nQ6BFp3z/0trdoVjy+lnHY5KMCQKBgQC2kQqtAXWe7QcwGqn7IZ/rRsOAl2BDb1Pb\nMW0OlblESX8tPfG8+7y0s9VgqQlkheEjEBulQcgHv6i+7juwd8d0s+99BCQNd4w2\nsN+XJU1qIDB7X9GcJyfvpeMT2NJuleFbTHE81f9y9HwjKLje+ZG39UUA7Ez3ppWL\nYnYwXMWucQKBgQC0wvPYgyGLA8q9dh3dzf158R3E6KtoJYzmUEUcoTLxggND2X9q\nuFOmF3haFa7GvdXxk47cK3lKhwo9H8qYixr8xxZNjgHCgalE/Qg1mBpf3GfL6CvR\nGMLw5N/+cEW8WUWYYMP8RFy5VmafKDt5oUJPXRaPO+IOes/ayOLRW2JpWQKBgGJL\n2amovYGiMVqPILJcOlRdN2oHFwd363h7NjLCHoxL3jOnxH5yM/o/UUXH/YyoIL3W\nMGxb7K1vXhXfAzhSZYvKTcnL7vVpRo8z0E77AKGBT1k+EAe5dWEsugS3myV7gWi8\n0cNlnTJxvFzZ0iAL049ueYaztAUrJh10GBqV+MGhAoGASgXp1QhmvKwL8mhOqp1a\nJ6+qbsXOJT9hzkZQ2mlZ8+eO4V9rAfSBdKow345jqHFIrOYLcIg2dJ5LPlTagACr\nGs07uLSaSpWzShktfHBQO7HQLHzobnb5HA2B634vKv5LKt6I2r4HBLzjpzOesOTK\n9ql+eXWw2YHrO03Nn2brvbQ=\n-----END PRIVATE KEY-----\n",
        "client_email": "ensileta@ensileta-files.iam.gserviceaccount.com",
        "client_id": "115663521354575558815",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ensileta%40ensileta-files.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
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