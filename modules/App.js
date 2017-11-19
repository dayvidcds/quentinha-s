var express = require('express');
var app = express();
var routerUser = require('./routes/RouterUser');
var routerRestaurant = require('./routes/RouterRestaurant');

app.use('/user', routerUser);

app.use('/restaurant', routerRestaurant);

app.use('/', (req, res) => {
    res.send({
        success: true,
        message: 'Welcome to the API',
        routes: [{
            insert_user: 'host/user/insert',
            login_user: 'host/user/login (require: cpf, name, password, tel, email)',
            home: 'host/user/home',
            logout_user: 'host/user/logout'
        }]
    })
})

// Inicio das rotas usuário

module.exports = app