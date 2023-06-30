
const products_controller = require('../controllers/product_controller');
const { admin_authenticate } = require('../jwt/jwt_authenticate');
const { upload } = require('../middlewares/multer');
const { productValidationRules } = require('../validations/product_validation');

function product_routes(app){  
    app.get('/products',  products_controller.allProducts);
    app.get('/product/:id',  products_controller.getProduct);
    app.post('/createProduct', admin_authenticate,  upload.array('image'), productValidationRules, products_controller.createProduct);
    app.put('/updateProduct/:id', admin_authenticate, upload.array('image'),  products_controller.updateProduct);
    app.delete('/deleteProduct/:id', admin_authenticate, products_controller.deleteProduct);
}

module.exports = {
    product_routes
}