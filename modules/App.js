var express = require('express');
var app = express();
var routerUser = require('./routes/RouterUser');

app.use('/user', routerUser);

app.get('/', (req, res) => {
    res.send('Bem vindo a API!')
})

// Inicio das rotas usuário

module.exports = app