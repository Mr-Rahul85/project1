import express from 'express';
import crypto from 'crypto';
import User from '../model/user.js'; 
import sendEmail from '../services/sendEmail.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    
    if (!user) {
      return res.status(200).json({ 
        message: 'If that email is in our system, a reset link has been sent.' 
      });
    }

    
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; 
    await user.save();

     
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const message = `You are receiving this email because a password reset was requested for your account.\n\n
    Please click on the following link to reset your password:\n\n
    ${resetUrl}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.`;

   
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      res.status(200).json({ 
        message: 'If that email is in our system, a reset link has been sent.' 
      });
      
    } catch (emailError) {
      
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return res.status(500).json({ message: 'There was an error sending the email. Try again later.' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'A server error occurred.' });
  }
});

export default router;