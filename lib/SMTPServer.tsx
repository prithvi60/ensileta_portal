import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NEXT_EMAIL_ID,
        pass: process.env.NEXT_EMAIL_PASSWORD,

    },
});


export const sendEmailNotification = async (recipientEmail: string, subject: string, message: string) => {
    const mailOptions = {
        from: process.env.NEXT_EMAIL_ID,
        to: recipientEmail,
        subject: subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
};