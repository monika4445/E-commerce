'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   User.hasOne(models.Cart, {foreignKey:'userId',key:'id'}, {foreignKey:'cartId', key:'id'})
    // }
  }
  User.init({
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER,
    is_verified: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};