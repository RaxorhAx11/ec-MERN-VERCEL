const { authMiddleware } = require('../controllers/auth/auth-controller');
const { handleCors } = require('../lib/middleware');

module.exports = async (req, res) => {
  // Handle CORS
  handleCors(req, res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    await authMiddleware(req, res, () => {
      const user = req.user;
      res.status(200).json({
        success: true,
        message: "Authenticated user!",
        user,
      });
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
