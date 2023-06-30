const { body } = require('express-validator');

const productValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('quantity').notEmpty().withMessage('Quantity is required').isLength({min:0}).withMessage('Quantity must be greater than or equal to 0'),
]

module.exports = {productValidationRules}