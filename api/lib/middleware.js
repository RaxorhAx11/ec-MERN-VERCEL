const jwt = require('jsonwebtoken');

// CORS middleware for Vercel
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CLIENT_BASE_URL || 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, Expires, Pragma',
  'Access-Control-Allow-Credentials': 'true',
};

const handleCors = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
  res.setHeader('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods']);
  res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
  res.setHeader('Access-Control-Allow-Credentials', corsHeaders['Access-Control-Allow-Credentials']);
};

// Cookie helpers compatible with Vercel serverless (no Express cookie-parser)
const parseCookies = (cookieHeaderValue) => {
  const cookies = {};
  if (!cookieHeaderValue) return cookies;
  const pairs = cookieHeaderValue.split(';');
  for (const pair of pairs) {
    const index = pair.indexOf('=');
    if (index === -1) continue;
    const key = pair.slice(0, index).trim();
    const value = decodeURIComponent(pair.slice(index + 1).trim());
    cookies[key] = value;
  }
  return cookies;
};

const getTokenFromRequest = (req) => {
  const bearer = req.headers.authorization?.replace('Bearer ', '');
  if (bearer) return bearer;
  const header = req.headers.cookie;
  const cookies = parseCookies(header);
  return cookies.token;
};

const serializeCookie = (name, value, options = {}) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join('; ');
};

const setAuthCookie = (res, token, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  const finalOptions = { ...defaultOptions, ...options };
  const headerValue = serializeCookie('token', token, finalOptions);
  res.setHeader('Set-Cookie', headerValue);
};

const clearAuthCookie = (res) => {
  const headerValue = serializeCookie('token', '', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
  });
  res.setHeader('Set-Cookie', headerValue);
};

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'CLIENT_SECRET_KEY');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.',
    });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};

module.exports = {
  handleCors,
  authMiddleware,
  adminMiddleware,
  parseCookies,
  getTokenFromRequest,
  setAuthCookie,
  clearAuthCookie,
};
