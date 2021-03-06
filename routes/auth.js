var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
    "/signup",
    [
        check("name")
            .isLength({ min: 3 })
            .withMessage("name should be atleast 3 characters"),
        check("email").isEmail().withMessage("email is requried"),
        check("password")
            .isLength({ min: 5 })
            .withMessage("password should be atleast 5 character"),
    ],
    signup
);

router.post(
    "/signin",
    [
        check("email").isEmail().withMessage("email is requried"),
        check("password")
            .isLength({ min: 1 })
            .withMessage("password field is requried"),
    ],
    signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
    res.json(req.auth);
});

module.exports = router;
