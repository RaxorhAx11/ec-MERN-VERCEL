const paypal = require("@paypal/paypal-server-sdk");

// Validate PayPal environment variables
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error("PayPal credentials are missing. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your environment variables.");
}

// Configure PayPal client
const client = new paypal.Client({
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  environment: process.env.PAYPAL_MODE === "live" 
    ? paypal.Environment.Production 
    : paypal.Environment.Sandbox
});

// Create controllers
const ordersController = new paypal.OrdersController(client);

module.exports = { paypal, client, ordersController };
