var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('../Persistence/ConnectionDB');

var routerUser = express.Router();
routerUser.use(bodyParser.urlencoded({ extended: true }));
routerUser.use(bodyParser.json());

var UserRepository = require('../persistence/UserRepository');
var UserBusiness = require('../business/UserBusiness');

var uRep = new UserRepository(db);

var userBusiness = new UserBusiness(uRep);

app.use('/user', routerUser);

// Inicio das rotas usuário

routerUser.get('/findAll', (req, res) => {
    userBusiness.findAllUsers().then((resp) => {
        res.send(resp)
    })
})

routerUser.post('/insert', (req, res) => {
    userBusiness.insert({
        cpf: req.body.cpf,
        name: req.body.name,
        password: req.body.password
    }).then((resp) => {
        res.send(resp)
    })
})

routerUser.post('/remove', (req, res) => {
    userBusiness.remove(
        req.body.password
    ).then((resp) => {
        res.send('ok')
    })
})

module.exports = app