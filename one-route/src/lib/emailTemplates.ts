/**
 * Email Templates for OneRoute Application
 * Contains reusable HTML email templates for various user communications
 */

export const welcomeTemplate = (userName: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 20px; border-radius: 5px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; margin-top: 20px; border-radius: 5px; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to OneRoute, ${userName}! 🎉</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>We're thrilled to have you onboard! OneRoute is here to help you navigate your journey seamlessly.</p>
          <p><strong>Get Started:</strong></p>
          <ul>
            <li>Complete your profile setup</li>
            <li>Explore the dashboard</li>
            <li>Connect with other users</li>
          </ul>
          <p>Start exploring your dashboard at <a href="https://app.oneroute.community">OneRoute Portal</a>.</p>
          <p>If you have any questions, don't hesitate to reach out to our support team.</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message. <a href="https://app.oneroute.community/contact">Contact Support</a></p>
          <p>&copy; 2026 OneRoute. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

export const passwordResetTemplate = (userName: string, resetLink: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ff6b6b; color: white; padding: 20px; border-radius: 5px; text-align: center; }
        .content { padding: 20px; }
        .cta-button { display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; margin-top: 20px; border-radius: 5px; }
        .warning { background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>You requested a password reset for your OneRoute account.</p>
          <div class="warning">
            <p><strong>⚠️ Important:</strong> This link expires in 24 hours. If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          </div>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" class="cta-button">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p><small>${resetLink}</small></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message. <a href="https://app.oneroute.community/contact">Contact Support</a></p>
          <p>&copy; 2026 OneRoute. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

export const applicationStatusTemplate = (
  userName: string,
  applicationId: string,
  status: "approved" | "rejected" | "pending",
  message?: string
) => {
  const statusConfig = {
    approved: { color: "#28a745", title: "Application Approved! 🎉", emoji: "✅" },
    rejected: { color: "#dc3545", title: "Application Update", emoji: "❌" },
    pending: { color: "#ffc107", title: "Application Under Review", emoji: "⏳" },
  };

  const config = statusConfig[status];

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: ${config.color}; color: white; padding: 20px; border-radius: 5px; text-align: center; }
          .content { padding: 20px; }
          .status-badge { display: inline-block; background-color: ${config.color}; color: white; padding: 8px 16px; border-radius: 20px; margin: 10px 0; }
          .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; margin-top: 20px; border-radius: 5px; }
          a { color: ${config.color}; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${config.emoji} ${config.title}</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>We have an update regarding your application (ID: <strong>${applicationId}</strong>).</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><span class="status-badge">${status.toUpperCase()}</span></p>
              ${message ? `<p>${message}</p>` : ""}
            </div>
            <p>Visit your dashboard to view more details: <a href="https://app.oneroute.community/applications">View Application</a></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message. <a href="https://app.oneroute.community/contact">Contact Support</a></p>
            <p>&copy; 2026 OneRoute. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const contactFormResponseTemplate = (senderName: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #17a2b8; color: white; padding: 20px; border-radius: 5px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; margin-top: 20px; border-radius: 5px; }
        a { color: #17a2b8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting Us</h1>
        </div>
        <div class="content">
          <p>Hi ${senderName},</p>
          <p>We received your message and appreciate you reaching out to OneRoute!</p>
          <p>Our support team will review your inquiry and get back to you as soon as possible, typically within 24-48 hours.</p>
          <p><strong>What to expect:</strong></p>
          <ul>
            <li>We'll review your message carefully</li>
            <li>A team member will contact you shortly</li>
            <li>We're here to help!</li>
          </ul>
          <p>In the meantime, feel free to check out our <a href="https://app.oneroute.community">dashboard</a> or FAQ section.</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message. <a href="https://app.oneroute.community/contact">Contact Support</a></p>
          <p>&copy; 2026 OneRoute. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;
