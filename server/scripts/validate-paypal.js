require("dotenv").config();
const { paypal, client, ordersController } = require("../helpers/paypal");

async function validatePayPalConfiguration() {
  console.log("🔍 Validating PayPal Configuration...\n");

  // Check environment variables
  const requiredEnvVars = [
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_MODE",
    "CLIENT_BASE_URL"
  ];

  console.log("📋 Environment Variables Check:");
  let allEnvVarsPresent = true;
  
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
      console.log(`✅ ${envVar}: ${envVar.includes('SECRET') ? '***' : value}`);
    } else {
      console.log(`❌ ${envVar}: Missing`);
      allEnvVarsPresent = false;
    }
  });

  if (!allEnvVarsPresent) {
    console.log("\n❌ PayPal configuration is incomplete. Please set all required environment variables.");
    process.exit(1);
  }

  console.log("\n🔧 PayPal SDK Configuration:");
  console.log(`Mode: ${process.env.PAYPAL_MODE}`);
  console.log(`Client ID: ${process.env.PAYPAL_CLIENT_ID.substring(0, 10)}...`);

  // Test PayPal API connection
  console.log("\n🌐 Testing PayPal API Connection...");
  
  try {
    // Create a test order to validate credentials
    const request = {
      intent: "CAPTURE",
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: "1.00",
          },
        },
      ],
      applicationContext: {
        returnUrl: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancelUrl: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
        brandName: "Test Store",
        landingPage: "NO_PREFERENCE",
        userAction: "PAY_NOW",
      },
    };

    const response = await ordersController.createOrder({ body: request });
    const order = response.result;

    if (order && order.id) {
      console.log("✅ PayPal API connection successful!");
      console.log(`Test Order ID: ${order.id}`);
      console.log(`Order Status: ${order.status}`);
      
      // Find approval URL
      const approvalLink = order.links.find((link) => link.rel === "approve");
      if (approvalLink) {
        console.log(`Approval URL: ${approvalLink.href}`);
      }
    } else {
      console.log("❌ PayPal API connection failed - no order ID returned");
    }

  } catch (error) {
    console.log("❌ PayPal API connection failed:");
    console.log(`Error: ${error.message}`);
    
    if (error.statusCode) {
      console.log(`Status Code: ${error.statusCode}`);
    }
    
    if (error.details) {
      console.log(`Details: ${JSON.stringify(error.details, null, 2)}`);
    }

    // Common error solutions
    console.log("\n💡 Common Solutions:");
    console.log("1. Verify your PayPal Client ID and Secret are correct");
    console.log("2. Ensure you're using sandbox credentials for development");
    console.log("3. Check that your PayPal app is approved and active");
    console.log("4. Verify your CLIENT_BASE_URL is accessible");
  }

  console.log("\n📚 Next Steps:");
  console.log("1. Install the new PayPal SDK: npm install @paypal/checkout-server-sdk");
  console.log("2. Remove the old SDK: npm uninstall paypal-rest-sdk");
  console.log("3. Test the checkout flow in your application");
  console.log("4. Use PayPal sandbox test accounts for testing");
}

// Run validation
validatePayPalConfiguration().catch(console.error);
