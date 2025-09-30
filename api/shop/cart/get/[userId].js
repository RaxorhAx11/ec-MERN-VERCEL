const connectDB = require('../../../lib/db');
const { fetchCartItems } = require('../../../controllers/shop/cart-controller');
const { handleCors, authMiddleware } = require('../../../lib/middleware');

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
    await connectDB();
    await authMiddleware(req, res, async () => {
      // Extract userId from query parameters
      req.params = { userId: req.query.userId };
      await fetchCartItems(req, res);
    });
  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
