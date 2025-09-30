const connectDB = require('../../lib/db');
const { getFilteredProducts } = require('../../controllers/shop/products-controller');
const { handleCors } = require('../../lib/middleware');

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
    await getFilteredProducts(req, res);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
