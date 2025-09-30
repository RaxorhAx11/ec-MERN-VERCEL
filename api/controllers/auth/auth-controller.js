const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/User");
const { sendPasswordResetEmail, sendWelcomeEmail } = require("../../helpers/email");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Validation
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { userName }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? "User already exists with this email" 
          : "Username is already taken",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = new User({
      userName: userName.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword,
    });

    await newUser.save();

    // Send welcome email (optional)
    try {
      await sendWelcomeEmail(email, userName);
    } catch (emailError) {
      console.log("Welcome email failed to send:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to WalkUp E-commerce",
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later.",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.JWT_SECRET || "CLIENT_SECRET_KEY",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("token", token, cookieOptions).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
};

//logout
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email address",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Send reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.userName);
    
    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Password reset instructions sent to your email",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

//reset password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }
    
    res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  logoutUser, 
  forgotPassword,
  resetPassword,
  authMiddleware 
};
