var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "2mn4fybdmdn3gqhk",
    publicKey: "kgdk5qp9p7vn6kwm",
    privateKey: "5da23614ba80b0db1b287995d9c964c2",
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.payment;

    let amountFromTheClient = req.body.amount;

    gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            //deviceData: deviceDataFromTheClient,
            options: {
                submitForSettlement: true,
            },
        },
        function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
};
