var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var cookieParser = require('cookie-parser');

var db = require('../Persistence/ConnectionDB');

var routerUser = express.Router();
routerUser.use(bodyParser.urlencoded({ extended: true }));
routerUser.use(bodyParser.json());

var UserRepository = require('../persistence/UserRepository');
var UserBusiness = require('../business/UserBusiness');

var routerRestaurant = require('./RouterRestaurant');

var uRep = new UserRepository(db);
var userBusiness = new UserBusiness(uRep);

routerUser.use(cookieParser());

routerUser.post('/login', (req, res) => {
    // clearCookie('userCookie')
    userBusiness.login({
        password: req.body.password,
        cpf: req.body.cpf
    }).then((resp) => {
        if (resp) {
            var jwtSecret = 'SECRET'
            var token = jwt.sign(resp.toJSON(), jwtSecret, {
                expiresIn: 1440
            })
            userBusiness.setOnline(resp.cpf, true)
            res.cookie('userCookie', {
                token: token,
                user: {
                    name: resp.name,
                    cpf: resp.cpf,
                    email: resp.email,
                    tel: resp.tel
                }
            })
            res.redirect('/user/home')
        } else {
            res.cookie('userCookie', {
                token: null,
                user: null
            })
            res.json({
                success: false,
                message: 'CPF ou senha inválidos!',
                token: null
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
    var token = req.cookies.userCookie.token // req.body.token || req.query.token || req.headers['x-access-token']
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

routerUser.get('/logout', (req, res) => {
    var userOn = req.cookies.userCookie.user
    userBusiness.setOnline(userOn.cpf, false)
    res.cookie('userCookie', {
        token: null
    })
    res.send({
        success: true,
        message: 'Token liberado!'
    })
})

routerUser.get('/home', (req, res) => {
    var userOn = req.cookies.userCookie.user
    res.send({
        success: true,
        message: 'Welcome',
        user: userOn
    })
})

routerUser.post('/askFood', (req, res) => {
    var userOn = req.cookies.userCookie.user
    var cnpj = req.body.cnpj
    var food = req.body.food
    var cpf = userOn.cpf
    foodSaleBusiness.insert(cpf, cnpj, food).then((resp) => {
        res.send({
            success: true,
            message: 'food was purchased'
        })
    })

})

routerUser.get('/restaurantsOnline', (req, res) => {
    userBusiness.findRestaurantsOnline().then((resp) => {
        res.send(resp)
    })
});

module.exports = routerUser