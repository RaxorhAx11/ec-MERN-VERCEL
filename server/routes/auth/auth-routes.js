const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected route
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;
