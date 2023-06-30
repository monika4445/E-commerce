const { Product } = require("../models");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

async function allProducts(req, res) {
  try {

    const products = await Product.findAll();
    res.status(201).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getProduct(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findOne({
      where: { id },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createProduct(req, res) {
  const { name, description, price, image, category } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      category,
    });
    
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, image, category } = req.body;

  try {
    await Product.update(
      { name, description, price, image, category },
      { where: { id } }
    );

    const updatedProduct = await Product.findByPk(id);

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    await Product.destroy({ where: { id } });
    res
      .status(200)
      .json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

module.exports = {
  allProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
