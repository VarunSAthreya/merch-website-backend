const express = require("express");
const { isAuthenticated, isSignedIn } = require("../controllers/auth");
const { processPayment, getToken } = require("../controllers/payment");
const router = express.Router();

router.get(
    "/payment/gateway/gettoken/:userId",
    isSignedIn,
    isAuthenticated,
    getToken
);

router.post(
    "/payment/braintree/:userId",
    isSignedIn,
    isAuthenticated,
    processPayment
);

module.exports = router;
