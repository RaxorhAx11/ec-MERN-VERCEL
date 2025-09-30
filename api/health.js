const { handleCors } = require('./lib/middleware');

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

  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
};
