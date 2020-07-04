var express = require("express");
var router = express.Router();
const { makepayment } = require("../controllers/stripePayment");

router.post("/stripepayment", makepayment);

module.exports = router;
