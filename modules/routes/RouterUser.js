var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var db = require('../../Persistence/ConnectionDB');

var routerUser = express.Router();
routerUser.use(bodyParser.urlencoded({ extended: true }));
routerUser.use(bodyParser.json());

var UserRepository = require('../../persistence/UserRepository');
var UserBusiness = require('../../business/UserBusiness');

var uRep = new UserRepository(db);

var userBusiness = new UserBusiness(uRep);

routerUser.post('/login', (req, res) => {
    userBusiness.login({
        password: req.body.password,
        cpf: req.body.cpf
    }).then((resp) => {
        if (resp) {
            var jwtSecret = 'SECRET'
            var token = jwt.sign(resp.toJSON(), jwtSecret, {
                expiresIn: 1440
            });
            res.json({
                success: true,
                message: 'Token criado!',
                token: token
            })
        } else {
            res.json({
                success: false,
                message: 'Token não criado!',
                token: 'null'
            })
        }
    })
})

routerUser.post('/insert', (req, res) => {
    userBusiness.insert({
        cpf: req.body.cpf,
        name: req.body.name,
        password: req.body.password,
        tel: req.body.tel,
        email: req.body.email
    }).then((resp) => {
        res.send(resp)
    })
})

routerUser.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token']

    if (token) {
        var jwtSecret = 'SECRET'
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Falha ao tentar autenticar o token!'
                })
            } else {
                //se tudo correr bem, salver a requisição para o uso em outras rotas
                req.decoded = decoded
                next();
            }
        })

    } else {
        // se não tiver o token, retornar o erro 403
        return res.status(403).send({
            success: false,
            message: 'Não há token.'
        })
    }
})


routerUser.get('/findAll', (req, res) => {
    userBusiness.findAllUsers().then((resp) => {
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

routerUser.get('/home', (req, res) => {
    res.send('BEM VINDO')
})

module.exports = routerUser