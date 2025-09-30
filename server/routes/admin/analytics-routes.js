const express = require("express");
const { getAdminAnalytics } = require("../../controllers/admin/analytics-controller");

const router = express.Router();

router.get("/", getAdminAnalytics);

module.exports = router;
