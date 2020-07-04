const stripe = require("stripe")(
    "sk_test_51H1Cw9EUqn7XzXigSd44RaHn0084zi4HoUu0O9Yi8sJGoNrNdwgA7AjBdjrwFaseZ9c3y5hpOU7cJgtj31g4K2wq005gXOgJ0u"
);
const uuid = require("uuid/v4");

exports.makepayment = (req, res) => {
    const { products, token } = req.body;
    console.log("Products", products);

    var amount = 0;
    products.map((product) => {
        amount += product.price;
    });

    const idempotencyKey = uuid();

    return stripe.customers
        .create({
            email: token.email,
            source: token.id,
        })
        .then((customer) => {
            stripe.charges
                .create(
                    {
                        amount: amount * 100,
                        currency: "usd",
                        customer: customer.id,
                        receipt_email: token.email,
                        description: "test",
                        shipping: {
                            name: token.card.name,
                            address: {
                                line1: token.card.address_line1,
                                line2: token.card.address_line2,
                                city: token.card.address_city,
                                country: token.card.address_country,
                                postal_code: token.card.address_zip,
                            },
                        },
                    },
                    { idempotencyKey }
                )
                .then((result) => res.status(200).json(result))
                .catch((err) => console.log(err));
        });
};
