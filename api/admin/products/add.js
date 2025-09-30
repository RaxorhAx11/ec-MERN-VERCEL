const connectDB = require('../../lib/db');
const { addProduct } = require('../../controllers/admin/products-controller');
const { handleCors, authMiddleware, adminMiddleware } = require('../../lib/middleware');

module.exports = async (req, res) => {
  // Handle CORS
  handleCors(req, res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    await connectDB();
    await authMiddleware(req, res, async () => {
      await adminMiddleware(req, res, async () => {
        await addProduct(req, res);
      });
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
