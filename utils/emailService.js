const nodemailer = require('nodemailer');

// Create transporter (using Ethereal for testing) - FIXED: createTransport (no 'e')
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'maddison53@ethereal.email',
    pass: 'jn7jnAPss4f63QBp6D'
  }
});

class EmailService {
  static async sendWelcomeEmail(userEmail, firstName, lastName) {
    const mailOptions = {
      from: '"TM2R Health" <noreply@tm2r.com>',
      to: userEmail,
      subject: 'Welcome to TM2R Health! 🏥 Your Healthcare Journey Begins',
      html: this.getWelcomeEmailTemplate(firstName, lastName, userEmail)
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', info.response);
      if (process.env.EMAIL_SERVICE === 'ethereal') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  static getWelcomeEmailTemplate(firstName, lastName, email) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #004d80, #1a6bd4); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .feature { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #004d80; }
          .footer { background: #f1f1f1; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to TM2R Health! 🎉</h1>
            <p>Your trusted healthcare companion</p>
          </div>
          <div class="content">
            <p>Hello <strong>${firstName} ${lastName}</strong>,</p>
            <p>Thank you for joining TM2R Health! We're excited to be part of your healthcare journey.</p>
            
            <div class="feature">
              <h3>Your Account Details:</h3>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Joined:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <h3>What you can do with TM2R Health:</h3>
            <div class="feature">
              <strong>📚 Access Health Information</strong>
              <p>Comprehensive guides on various diseases and conditions</p>
            </div>
            <div class="feature">
              <strong>💡 Lifestyle Recommendations</strong>
              <p>Personalized health and wellness advice</p>
            </div>
            <div class="feature">
              <strong>🏥 Symptom Checker</strong>
              <p>Understand your symptoms and when to seek help</p>
            </div>
            <div class="feature">
              <strong>📊 Health Tracking</strong>
              <p>Monitor your health journey over time</p>
            </div>

            <p>We're committed to providing you with reliable, up-to-date healthcare information to help you make informed decisions about your health.</p>
          </div>
          <div class="footer">
            <p><strong>TM2R Health Team</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = EmailService;