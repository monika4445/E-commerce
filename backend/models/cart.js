'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {foreignKey:'userId',key:'id'});
      Cart.belongsToMany(models.Product,{through:models.CartItem,foreignKey:'cartId', key:'id'});
      Cart.hasMany(models.CartItem, {foreignKey:'cartId', key:'id'});
      Cart.hasMany(models.Order, {foreignKey:'cartId', key:'id'});
    }
  }
  Cart.init({
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};