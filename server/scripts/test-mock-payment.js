require("dotenv").config();

async function testMockPayment() {
  console.log("🧪 Testing Mock Payment System...\n");

  try {
    // Test 1: Create mock order
    console.log("1. Testing mock order creation...");
    
    const orderData = {
      userId: "507f1f77bcf86cd799439011", // Valid ObjectId format
      cartId: "507f1f77bcf86cd799439012", // Valid ObjectId format
      cartItems: [{
        productId: "507f1f77bcf86cd799439013", // Valid ObjectId format
        title: "Test Product",
        image: "https://example.com/image.jpg",
        price: 10,
        quantity: 1
      }],
      addressInfo: {
        addressId: "507f1f77bcf86cd799439014", // Valid ObjectId format
        address: "123 Test Street",
        city: "Test City",
        pincode: "12345",
        phone: "1234567890",
        notes: "Test order"
      },
      totalAmount: 10,
      paymentMethod: "mock"
    };

    const response = await fetch("http://localhost:5000/api/shop/mock-payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ Mock order creation successful!");
      console.log(`Order ID: ${result.orderId}`);
      console.log(`Mock Payment ID: ${result.mockPaymentId}`);
      console.log(`Approval URL: ${result.approvalURL}`);
      
      // Test 2: Capture mock payment
      console.log("\n2. Testing mock payment capture...");
      
      const captureData = {
        paymentId: result.mockPaymentId,
        payerId: "test_payer_id",
        orderId: result.orderId
      };

      const captureResponse = await fetch("http://localhost:5000/api/shop/mock-payment/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(captureData)
      });

      const captureResult = await captureResponse.json();
      
      if (captureResult.success) {
        console.log("✅ Mock payment capture successful!");
        console.log(`Payment Status: ${captureResult.mockPaymentDetails.status}`);
        console.log(`Amount: $${captureResult.mockPaymentDetails.amount}`);
      } else {
        console.log("❌ Mock payment capture failed:");
        console.log(captureResult.message);
      }
      
    } else {
      console.log("❌ Mock order creation failed:");
      console.log(result.message);
      if (result.error) {
        console.log("Error details:", result.error);
      }
    }

  } catch (error) {
    console.log("❌ Test failed with error:");
    console.log(error.message);
  }

  console.log("\n🎯 Mock Payment System Test Complete!");
  console.log("\n📋 Next Steps:");
  console.log("1. Start your client: cd client && npm run dev");
  console.log("2. Go to checkout page");
  console.log("3. Click 'Test with Mock Payment' button");
  console.log("4. Test the complete flow");
}

testMockPayment().catch(console.error);
