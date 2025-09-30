const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createMockOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create mock payment ID
    const mockPaymentId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockPayerId = `payer_${Math.random().toString(36).substr(2, 9)}`;

    // Create order in database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod: paymentMethod || "mock",
      paymentStatus: "pending",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: mockPaymentId,
      payerId: mockPayerId,
    });

    await newlyCreatedOrder.save();

    // Simulate PayPal approval URL
    const mockApprovalURL = `${process.env.CLIENT_BASE_URL}/shop/mock-payment-return?paymentId=${mockPaymentId}&PayerID=${mockPayerId}`;

    res.status(201).json({
      success: true,
      approvalURL: mockApprovalURL,
      orderId: newlyCreatedOrder._id,
      mockPaymentId: mockPaymentId,
      message: "Mock payment initiated successfully"
    });

  } catch (error) {
    console.error("Mock payment creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating mock payment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const captureMockPayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate payment success (90% success rate for testing)
    const isPaymentSuccessful = Math.random() > 0.1;

    if (isPaymentSuccessful) {
      // Payment successful, update order
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.payerId = payerId;

      // Update product stock
      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found`,
          });
        }

        // Ensure stock doesn't go negative
        if (item.quantity > product.totalStock) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.title}`,
          });
        }

        product.totalStock -= item.quantity;
        await product.save();
      }

      // Clear cart
      const getCartId = order.cartId;
      await Cart.findByIdAndDelete(getCartId);

      await order.save();

      res.status(200).json({
        success: true,
        message: "Mock payment completed successfully",
        data: order,
        mockPaymentDetails: {
          paymentId: paymentId,
          payerId: payerId,
          amount: order.totalAmount,
          status: "COMPLETED",
          timestamp: new Date().toISOString()
        }
      });
    } else {
      // Simulate payment failure
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
      await order.save();

      res.status(400).json({
        success: false,
        message: "Mock payment failed (simulated failure for testing)",
        mockPaymentDetails: {
          paymentId: paymentId,
          payerId: payerId,
          status: "FAILED",
          reason: "Insufficient funds (simulated)"
        }
      });
    }

  } catch (error) {
    console.error("Mock payment capture error:", error);
    res.status(500).json({
      success: false,
      message: "Mock payment capture failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getMockPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Simulate different payment statuses for testing
    const statuses = ["PENDING", "COMPLETED", "FAILED", "CANCELLED"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    res.status(200).json({
      success: true,
      paymentId: paymentId,
      status: randomStatus,
      timestamp: new Date().toISOString(),
      message: `Mock payment status: ${randomStatus}`
    });

  } catch (error) {
    console.error("Mock payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting mock payment status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createMockOrder,
  captureMockPayment,
  getMockPaymentStatus,
};
