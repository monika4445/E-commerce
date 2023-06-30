const user_controller = require('../controllers/user_controller');

function user_routes(app){  
    app.get('/users', user_controller.allUsers) 
    app.get('/verify', user_controller.confirm_email)
    app.post('/register', user_controller.registerValidationRules, user_controller.register);
    app.post('/login', user_controller.loginValidationRules, user_controller.login);
}

module.exports = {user_routes}