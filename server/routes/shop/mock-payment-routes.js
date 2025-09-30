const express = require("express");
const {
  createMockOrder,
  captureMockPayment,
  getMockPaymentStatus,
} = require("../../controllers/shop/mock-payment-controller");

const router = express.Router();

// Mock payment routes
router.post("/create", createMockOrder);
router.post("/capture", captureMockPayment);
router.get("/status/:paymentId", getMockPaymentStatus);

module.exports = router;
