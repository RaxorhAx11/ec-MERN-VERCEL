const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.CLIENT_BASE_URL}/auth/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - WalkUp E-commerce',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">WalkUp E-commerce</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #666; line-height: 1.6;">
            We received a request to reset your password for your WalkUp E-commerce account.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            This link will expire in 1 hour for security reasons.
          </p>
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 WalkUp E-commerce. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send password reset email' };
  }
};

const sendWelcomeEmail = async (email, userName) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to WalkUp E-commerce!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to WalkUp!</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome ${userName}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for joining WalkUp E-commerce! We're excited to have you on board.
          </p>
          <p style="color: #666; line-height: 1.6;">
            You can now start shopping for amazing products and enjoy our premium shopping experience.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_BASE_URL}/shop/home" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Start Shopping
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 WalkUp E-commerce. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: 'Failed to send welcome email' };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
