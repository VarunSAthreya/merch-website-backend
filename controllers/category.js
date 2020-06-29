const Category = require("../models/category");
const category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err) {
            res.status(400).json({
                error: "Category not found on DB",
            });
        }
        req.category = category;
        next();
    });
};

exports.createCatagory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err) {
            res.status(400).json({
                error: "Not able to save Category in DB",
            });
        }
        res.json(category);
    });
};

exports.getCategory = (req, res) => {
    return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, category) => {
        if (err) {
            res.status(400).json({
                error: "No Categories found",
            });
        }
        res.json(category);
    });
};

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if (err) {
            res.status(400).json({
                error: "Failed to UPDATE CATEGORY",
            });
        }
        res.json(updatedCategory);
    });
};

exports.removeCategory = (req, res) => {
    const category = req.category;

    category.remove((err, removedCategory) => {
        if (err) {
            res.status(400).json({
                error: "Failed to REMOVE CATEGORY",
            });
        }
        res.json({
            message: "Successfully Deleted ",
        });
    });
};
