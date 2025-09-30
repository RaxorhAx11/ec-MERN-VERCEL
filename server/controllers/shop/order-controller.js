const { paypal, client, ordersController } = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
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

    // Create PayPal order using new SDK
    const request = {
      intent: "CAPTURE",
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              itemTotal: {
                currencyCode: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title,
            unitAmount: {
              currencyCode: "USD",
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
            sku: item.productId,
          })),
        },
      ],
      applicationContext: {
        returnUrl: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancelUrl: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
        brandName: "Your Store",
        landingPage: "NO_PREFERENCE",
        userAction: "PAY_NOW",
      },
    };

    try {
      const response = await ordersController.createOrder({ body: request });
      const order = response.result;

      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId: order.id,
        payerId: "",
      });

      await newlyCreatedOrder.save();

      // Find approval URL
      const approvalLink = order.links.find((link) => link.rel === "approve");
      const approvalURL = approvalLink ? approvalLink.href : null;

      res.status(201).json({
        success: true,
        approvalURL,
        orderId: newlyCreatedOrder._id,
        paypalOrderId: order.id,
      });
    } catch (error) {
      console.error("PayPal order creation error:", error);
      return res.status(500).json({
        success: false,
        message: "Error while creating PayPal payment",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // Capture PayPal payment using new SDK
    const request = {};

    try {
      const response = await ordersController.captureOrder(order.paymentId, { body: request });
      const capturedOrder = response.result;

      if (capturedOrder.status === "COMPLETED") {
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
          message: "Order confirmed",
          data: order,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Payment was not completed",
        });
      }
    } catch (error) {
      console.error("PayPal payment capture error:", error);
      return res.status(500).json({
        success: false,
        message: "Payment capture failed",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
