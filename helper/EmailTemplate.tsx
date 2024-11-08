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