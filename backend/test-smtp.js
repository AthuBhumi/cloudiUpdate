const nodemailer = require('nodemailer');

async function testSMTP() {
  try {
    console.log('🔧 Testing SMTP connection...');
    console.log('📧 Email: atharvar.ce20@svpcetngp.edu.in');
    console.log('🔑 Note: You need to use Gmail App Password, not regular password');
    console.log('');
    
    // Create transporter with your credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: 'atharvar.ce20@svpcetngp.edu.in',
        pass: 'rjfx vxwj divi xxkt' // This needs to be App Password
      }
    });

    console.log('📡 Verifying connection...');
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    console.log('📧 Sending test email...');
    // Send test email
    const testEmail = {
      from: 'Cloudidada Admin <atharvar.ce20@svpcetngp.edu.in>',
      to: 'atharvar.ce20@svpcetngp.edu.in',
      subject: '🎉 SMTP Test Email - Cloudidada Admin Panel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🎉 SMTP Configuration Test Successful!</h2>
          <p>This is a test email to verify your SMTP configuration is working correctly.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📋 Configuration Details:</h3>
            <ul>
              <li><strong>Host:</strong> smtp.gmail.com</li>
              <li><strong>Port:</strong> 587</li>
              <li><strong>Security:</strong> STARTTLS</li>
              <li><strong>Username:</strong> atharvar.ce20@svpcetngp.edu.in</li>
              <li><strong>Status:</strong> ✅ Working</li>
            </ul>
          </div>
          
          <p>✅ If you received this email, your SMTP configuration is working properly!</p>
          <p>You can now use this configuration in your Cloudidada Admin Panel.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #6B7280; font-size: 12px;">
            Sent from Cloudidada Admin Panel<br>
            ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📨 Email sent to: atharvar.ce20@svpcetngp.edu.in');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Check your email inbox');
    console.log('2. Use these settings in the admin panel');
    console.log('3. Make sure to use App Password for Gmail');
    
  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    
    if (error.code === 'EAUTH') {
      console.log('🔑 Authentication failed - Follow these steps:');
      console.log('   1. Enable 2-Factor Authentication in Google Account');
      console.log('   2. Generate App Password: Google Account → Security → App passwords');
      console.log('   3. Use the 16-character App Password instead of regular password');
      console.log('   4. Format: "xxxx xxxx xxxx xxxx" (spaces optional)');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🌐 SMTP host not found - check host address');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🚫 Connection refused - check host and port');
    }
    
    console.log('');
    console.log('📖 Gmail SMTP Setup Guide:');
    console.log('   Host: smtp.gmail.com');
    console.log('   Port: 587');
    console.log('   Security: STARTTLS (not SSL)');
    console.log('   Username: your-email@gmail.com');
    console.log('   Password: your-app-password (not regular password)');
  }
}

testSMTP();
