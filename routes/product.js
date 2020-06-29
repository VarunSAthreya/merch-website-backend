const express = require("express");
const router = express.Router();

const {
    getProductById,
    createProduct,
    getProduct,
    photo,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// ALL OF PARAMS
router.param("userId", getUserById);
router.param("productId", getProductById);

//ALL OF ACTUAL ROUTES

// CREATE ROUTES

router.post(
    "/product/create/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct
);

// READ ROUTES

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// DELETE ROUTES

router.delete(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAuthenticated,
    deleteProduct
);

// UPDATE ROUTES

router.put(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAuthenticated,
    updateProduct
);

// LISTING ROUTES

router.get("/products", getAllProducts);

router.get("/product/categories", getAllUniqueCategories);

module.exports = router;
