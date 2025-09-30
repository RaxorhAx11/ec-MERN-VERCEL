# Vercel Deployment Guide for MERN E-commerce App

This guide will help you deploy your MERN stack e-commerce application to Vercel.

## Project Structure

```
ec-MERN/
├── api/                          # Serverless functions
│   ├── auth/                     # Authentication endpoints
│   │   ├── register.js
│   │   ├── login.js
│   │   ├── logout.js
│   │   ├── forgot-password.js
│   │   ├── reset-password.js
│   │   └── check-auth.js
│   ├── shop/                     # Shop endpoints
│   │   ├── products/
│   │   ├── cart/
│   │   ├── address/
│   │   ├── order/
│   │   ├── mock-payment/
│   │   ├── search/
│   │   └── review/
│   ├── admin/                    # Admin endpoints
│   │   ├── products/
│   │   ├── orders/
│   │   └── analytics/
│   ├── common/                   # Common endpoints
│   │   └── feature/
│   ├── lib/                      # Shared utilities
│   │   ├── db.js                 # Database connection
│   │   └── middleware.js         # Middleware functions
│   ├── models/                   # Mongoose models
│   ├── controllers/              # Route controllers
│   └── helpers/                  # Helper functions
├── client/                       # React frontend
├── package.json                  # Root package.json
├── vercel.json                   # Vercel configuration
└── vercel-env.example           # Environment variables template
```

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a cloud database at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string

## Step 2: Configure Environment Variables

In your Vercel dashboard, go to your project settings and add these environment variables:

### Required Variables:
- `MONGODB_URL`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `CLIENT_BASE_URL`: Your Vercel app URL (e.g., https://your-app.vercel.app)

### Optional Variables:
- `EMAIL_HOST`: SMTP server for emails
- `EMAIL_USER`: Email username
- `EMAIL_PASS`: Email password
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `PAYPAL_CLIENT_ID`: PayPal client ID
- `PAYPAL_CLIENT_SECRET`: PayPal client secret

## Step 3: Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect the configuration and deploy

## Step 4: Configure Vercel Settings

1. **Build Command**: `npm run build`
2. **Output Directory**: `client/dist`
3. **Install Command**: `npm run install-all`

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test the health endpoint: `https://your-app.vercel.app/api/health`
3. Test authentication endpoints
4. Test product listing and other features

## API Endpoints

All API endpoints are available at `/api/`:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/check-auth` - Check authentication status

### Shop
- `GET /api/shop/products/get` - Get products
- `GET /api/shop/products/get/[id]` - Get product details
- `POST /api/shop/cart/add` - Add to cart
- `GET /api/shop/cart/get` - Get cart items
- `POST /api/shop/order/create` - Create order

### Admin
- `GET /api/admin/products/get` - Get all products (admin)
- `POST /api/admin/products/create` - Create product (admin)
- `PUT /api/admin/products/update/[id]` - Update product (admin)
- `DELETE /api/admin/products/delete/[id]` - Delete product (admin)

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `CLIENT_BASE_URL` is set correctly
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Build Failures**: Check that all dependencies are installed
4. **Function Timeouts**: Increase timeout in vercel.json if needed

### Debugging:

1. Check Vercel function logs in the dashboard
2. Use `console.log()` statements in your functions
3. Test endpoints individually using tools like Postman

## Performance Optimization

1. **Database Connection**: The `db.js` file uses connection pooling
2. **Caching**: Consider implementing Redis for session storage
3. **CDN**: Vercel automatically provides CDN for static assets
4. **Image Optimization**: Use Vercel's image optimization features

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS**: Configure CORS properly for production
3. **Rate Limiting**: Consider implementing rate limiting
4. **Input Validation**: Validate all inputs in serverless functions

## Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider integrating Sentry
3. **Performance Monitoring**: Use Vercel's built-in monitoring

## Scaling

- Vercel automatically scales serverless functions
- MongoDB Atlas scales with your usage
- Consider implementing caching for better performance
- Monitor function execution times and optimize accordingly

## Support

For issues specific to this deployment:
1. Check Vercel documentation
2. Review MongoDB Atlas documentation
3. Check the project's GitHub issues
4. Contact the development team
