const express = require("express");
const router = express.Router();

const {
    getCategoryById,
    createCatagory,
    getCategory,
    getAllCategories,
    updateCategory,
    removeCategory,
} = require("../controllers/category");
const { isAuthenticated, isAdmin, isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { create } = require("../models/user");

// PARAMS
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// ACTUAL ROUTES GOES HERE

// CREATE ROUTES

router.post(
    "/category/create/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCatagory
);

// READ ROUTES

router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

// UPDATE ROUTES

router.put(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);

// DELETE ROUTES

router.delete(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory
);

module.exports = router;
