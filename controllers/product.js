const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "PRODUCT not found",
                });
            }
            req.product = product;
            next();
        });
};

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image",
            });
        }

        // DESTRUCTURE THE FILEDS
        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please include all FIELDS",
            });
        }

        let product = new Product(fields);

        //HANDEL FILE HERE
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size TOO BIG",
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        //console.log(product);

        /// SAVE TO THE DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Error Saving tshrt in DB",
                });
            }
            res.json(product);
        });
    });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

// MIDDLEWARE
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

//DELETE CONTROLLERS
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Filed to DELETE PRODUCT",
            });
        }
        res.json({
            message: "Deletion was a success",
            deletedProduct,
        });
    });
};

//UPDATE CONTROLLERS
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image",
            });
        }

        // UPDATION CODE
        let product = req.product;
        product = _.extend(product, fields);

        //HANDEL FILE HERE
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size TOO BIG",
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        /// SAVE TO THE DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Error updating product in DB",
                });
            }
            res.json(product);
        });
    });
};

// PRODUCT LISTING

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortB : "_id";

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(8)
        .exec((err, products) => {
            if (limit) {
                return res.status(400).json({
                    error: "NO PRODUCT FOUND",
                });
            }
            res.json(products);
        });
};

// MIDDLEWARE

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map((prod) => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } },
            },
        };
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "BULK OPERATION FAILER",
            });
        }
    });
};
