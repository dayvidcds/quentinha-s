const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(cookieParser())

class RouterUser {
    constructor(userBusiness, pagesDir, foodSaleBusiness) {
        this.userBusiness = userBusiness
        this.initializeRoutes()
        this.foodSaleBusiness = foodSaleBusiness
        this.pagesDir = pagesDir
        this.router = router
    }

    initializeRoutes() {

        router.post('/login', (req, res) => {
            // console.log(req.body)
            // clearCookie('userCookie')
            this.userBusiness.login({
                password: req.body.password,
                cpf: req.body.cpf
            }).then((resp) => {
                if (resp) {
                    var jwtSecret = 'SECRET'
                    var token = jwt.sign(resp.toJSON(), jwtSecret, {
                        expiresIn: 1440
                    })
                    this.userBusiness.setOnline(resp.cpf, true)
                    res.cookie('userCookie', {
                            token: token,
                            user: {
                                name: resp.name,
                                cpf: resp.cpf,
                                email: resp.email,
                                tel: resp.tel
                            }
                        })
                        // res.sendFile(this.pagesDir + '/dash.html')
                        //res.sendFile(this.pagesDir + '/user/profile.html')
                    res.redirect('/api/user/profile')
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

        router.post('/insert', (req, res) => {
            this.userBusiness.insert({
                cpf: req.body.cpf,
                name: req.body.name,
                password: req.body.password,
                tel: req.body.tel,
                email: req.body.email
            }).then((resp) => {
                res.redirect('/user/login')
            })
        })

        router.use((req, res, next) => {
            var token = req.cookies.userCookie.token // req.body.token || req.query.token || req.headers['x-access-token']
            if (token) {
                var jwtSecret = 'SECRET'
                jwt.verify(token, jwtSecret, (err, decoded) => {
                    if (err) {
                        res.cookie('userCookie', {
                            token: null,
                            user: null
                        })
                        return res.redirect('/user/login')
                    } else {
                        // se tudo correr bem, salver a requisição para o uso em outras rotas
                        req.decoded = decoded
                        next()
                    }
                })
            } else {
                // se não tiver o token, retornar o erro 403
                res.cookie('userCookie', {
                    token: null,
                    user: null
                })

                return res.redirect('/user/login')
            }
        })

        router.get('/findAll', (req, res) => {
            this.userBusiness.findAllUsers().then((resp) => {
                res.send(resp)
            })
        })

        router.post('/remove', (req, res) => {
            this.userBusiness.remove(
                req.body.password
            ).then((resp) => {
                res.send('ok')
            })
        })

        router.get('/logout', (req, res) => {
            var userOn = req.cookies.userCookie.user
            this.userBusiness.setOnline(userOn.cpf, false)
            res.cookie('userCookie', {
                token: null
            })
            res.redirect('/user/login')
        })

        router.get('/home', (req, res) => {
            var userOn = req.cookies.userCookie.user
            res.send({
                success: true,
                message: 'Welcome',
                profile: userOn
            })
        })

        router.get('/profile', (req, res) => {
            res.sendFile(this.pagesDir + '/user/profile.html')
        })

        router.get('/findFoods/:cnpj', (req, res) => {
            res.cookie('restaurantInfoCookie', {
                restaurant: {
                    cnpj: req.params.cnpj
                }
            })
            res.sendFile(this.pagesDir + '/user/foods.html')
        })

        router.post('/askFood', (req, res) => {
            var userOn = req.cookies.userCookie.user
            var restaurantOn = req.cookies.restaurantInfoCookie
            var cnpj = restaurantOn.restaurant.cnpj
            var food = req.body.food
            var cpf = userOn.cpf
            this.foodSaleBusiness.insert(cpf, cnpj, food).then((resp) => {
                res.redirect('profile')
            })
        })

        router.get('/restaurantsOnline', (req, res) => {
            this.userBusiness.findRestaurantsOnline().then((resp) => {
                res.json(resp)
            })
        })
    }
}
module.exports = RouterUser