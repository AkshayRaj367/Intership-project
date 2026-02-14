import nodemailer from 'nodemailer';
import { logger } from '@/utils/logger';
import { IEmailOptions } from '@/types';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection on initialization
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info('✅ Email service connected successfully');
    } catch (error) {
      logger.error('❌ Email service connection failed:', error);
    }
  }

  async sendEmail(options: IEmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'TechFlow'}" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`📧 Email sent successfully to ${options.to}: ${info.messageId}`);
      return true;

    } catch (error) {
      logger.error(`❌ Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendContactConfirmation(name: string, email: string, message: string): Promise<boolean> {
    const html = this.getContactConfirmationTemplate(name, message);
    const subject = 'Thank you for contacting TechFlow!';

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Thank you for contacting TechFlow!\n\nHi ${name},\n\nWe've received your message and will get back to you within 24-48 hours.\n\nYour message:\n"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"\n\nBest regards,\nTechFlow Team`,
    });
  }

  async sendNewContactNotification(name: string, email: string, message: string, ipAddress?: string): Promise<boolean> {
    const html = this.getNewContactNotificationTemplate(name, email, message, ipAddress);
    const subject = '🔔 New Contact Form Submission - TechFlow';

    return this.sendEmail({
      to: process.env.EMAIL_USER!,
      subject,
      html,
      text: `New message from: ${name} (${email})\n\nMessage:\n${message}\n\nSubmitted: ${new Date().toISOString()}\n${ipAddress ? `IP: ${ipAddress}` : ''}`,
    });
  }

  private getContactConfirmationTemplate(name: string, message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting TechFlow</title>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a73e8 0%, #34a853 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .message-preview { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a73e8; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 TechFlow</div>
            <h1>Thank you for contacting us!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We've received your message and will get back to you within 24-48 hours. Our team is excited to learn more about how we can help you.</p>
            
            <div class="message-preview">
              <h3>Your message:</h3>
              <p>"${message.substring(0, 300)}${message.length > 300 ? '...' : ''}"</p>
            </div>
            
            <p>In the meantime, feel free to explore our features or check out our documentation.</p>
            
            <div class="footer">
              <p>Best regards,<br>The TechFlow Team</p>
              <p>📧 hello@techflow.com | 🌐 www.techflow.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getNewContactNotificationTemplate(name: string, email: string, message: string, ipAddress?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d93025 0%, #ea4335 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .info-item { background: white; padding: 15px; border-radius: 8px; }
          .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d93025; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .badge { background: #d93025; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Contact Form Submission</h1>
            <span class="badge">URGENT</span>
          </div>
          <div class="content">
            <div class="info-grid">
              <div class="info-item">
                <strong>👤 Name:</strong><br>
                ${name}
              </div>
              <div class="info-item">
                <strong>📧 Email:</strong><br>
                <a href="mailto:${email}">${email}</a>
              </div>
              ${ipAddress ? `
              <div class="info-item">
                <strong>🌐 IP Address:</strong><br>
                ${ipAddress}
              </div>
              ` : ''}
              <div class="info-item">
                <strong>🕐 Submitted:</strong><br>
                ${new Date().toLocaleString()}
              </div>
            </div>
            
            <div class="message-box">
              <h3>💬 Message:</h3>
              <p>${message}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${email}" style="background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                📧 Reply to Customer
              </a>
            </div>
            
            <div class="footer">
              <p>This message was sent from the TechFlow contact form.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
}

// Create singleton instance
export const emailService = new EmailService();
export default emailService;
