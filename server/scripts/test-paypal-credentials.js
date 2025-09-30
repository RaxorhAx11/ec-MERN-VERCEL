require("dotenv").config();

// Test with different credential combinations
const testCredentials = [
  {
    name: "Environment Credentials",
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    environment: process.env.PAYPAL_MODE || "sandbox",
  }
];

async function testPayPalCredentials() {
  console.log("🧪 Testing PayPal Credentials...\n");
  
  for (const cred of testCredentials) {
    console.log(`Testing: ${cred.name}`);
    console.log(`Client ID: ${cred.clientId?.substring(0, 10)}...`);
    
    try {
      const paypal = require("@paypal/paypal-server-sdk");
      const client = new paypal.Client({
        clientId: cred.clientId,
        clientSecret: cred.clientSecret,
        environment: (cred.environment === "live" ? paypal.Environment.Production : paypal.Environment.Sandbox)
      });
      
      const ordersController = new paypal.OrdersController(client);
      
      const request = {
        intent: "CAPTURE",
        purchaseUnits: [{
          amount: {
            currencyCode: "USD",
            value: "1.00"
          }
        }]
      };
      
      const response = await ordersController.createOrder({ body: request });
      
      if (response.result && response.result.id) {
        console.log("✅ SUCCESS! These credentials work.");
        console.log(`Order ID: ${response.result.id}`);
        return cred;
      }
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
    }
    console.log("");
  }
  
  console.log("❌ All credentials failed. You need to get new PayPal sandbox credentials.");
  console.log("\n📋 Steps to fix:");
  console.log("1. Go to https://developer.paypal.com/");
  console.log("2. Create a new sandbox app");
  console.log("3. Copy the Client ID and Secret");
  console.log("4. Update your .env file");
}

testPayPalCredentials().catch(console.error);
