export function generateEmailTemplate(mainContent: any) {
  const imageUrl =
    "https://ik.imagekit.io/webibee/newlogo2.png?updatedAt=1730964119061";
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Acknowledgment or Notifications</title>
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h2 { font-size: 24px; }
        p { margin: 10px 0; }
        .contain { display: inline; color: #65a34e; font-size: 24px;}
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hi Sir/Madam,</h2>
        <p>Greetings from <span class="contain">ENSILETA INTERIORS</span></p>
        ${mainContent}
        <p>Best regards,</p>
        <div>
          <img alt="company logo" src="${imageUrl}" />
          <h3>Ensileta Interior</h3>
          <p><strong>Address:</strong> No.77 Old no:43 Second floor, Chamiers Rd, Chennai, Tamil Nadu 600028</p>
          <p><strong>Contact Now:</strong> 9380289546</p>
          <p><strong>Website:</strong> <a href="https://www.ensileta.com" target="_blank">www.ensileta.com</a></p>
        </div>
      </div>
    </body>
    </html>
    `;
}

export function generateOtpEmailTemplate(otp: string, expiryTime: string) {
  const imageUrl = "https://ik.imagekit.io/webibee/newlogo2.png?updatedAt=1730964119061";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${imageUrl}" alt="Ensileta Interiors Logo" style="width: 150px; height: auto;">
      </div>
      <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">One-Time Password (OTP) for Ensileta Interiors Account</h2>
      <p style="font-size: 16px; color: #555;">
        Use the following one-time password (OTP) to sign in to your Ensileta Interiors Account:
      </p>
      <p style="font-size: 24px; font-weight: bold; color:#64A24E; text-align: center; margin: 20px 0;">
        ${otp}
      </p>
      <p style="font-size: 16px; color: #555;">
        This OTP is valid for <span style="margin-left: 1.5px; margin-right: 1.5px; font-weight: bold;">10 minutes</span> until <span style="margin-left: 1.5px; margin-right: 1.5px; font-weight: bold;">${expiryTime} </span> (GMT +05:30).
      </p>
      <p style="font-size: 16px; color: #555;">
        For further clarifications, please contact this number:
        <span><strong>9380289546</strong></span>.
      </p>
      <p style="font-size: 16px; color: #555;">Greetings from Ensileta Interiors Team!</p>
      <br/>
      <br/>
      <div style="font-size: 16px;">
        <h3 style="font-size: 24px; color:#64A24E;">Ensileta Interior</h3>
          <p><strong>Address:</strong> No.77 Old no:43 Second floor, Chamiers Rd, Chennai, Tamil Nadu 600028</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 14px;">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} 
          <span style="margin-left: 1.5px; margin-right: 1.5px;">
            <a target="_blank" href="https://www.ensileta.com" style="color: #007bff; text-decoration: none;">Ensileta Interiors</a>
          </span>
          . All rights reserved.
        </p>
      </div>
    </div>
  `;
}