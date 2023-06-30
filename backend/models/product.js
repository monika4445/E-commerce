'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    // static associate(models) {
    //   Product.belongsTo(models.Category,{foreignKey:'categoryId'});
    //   Product.hasMany(models.Image, {foreignKey:'productId'});
    //   Product.belongsToMany(models.Cart, { through: models.CartItem, foreignKey:'cartId', key:'id' });
    //   Product.hasMany(models.CartItem, {foreignKey:'productId', key:'id'});

    // }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};