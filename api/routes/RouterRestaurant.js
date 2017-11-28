const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(cookieParser())

class RouterRestaurant {
    constructor(restaurantBusiness, pagesDir) {
        this.restaurantBusiness = restaurantBusiness
        this.initializeRoutes()
        this.pagesDir = pagesDir
        this.router = router
    }

    initializeRoutes() {

        router.get('/getPerfil', (req, res) => {
            var restaurantOn = req.cookies.restaurantInfoCookie
            var cnpj = restaurantOn.restaurant.cnpj.toString()
            this.restaurantBusiness.findFoods(cnpj).then((resp) => {
                res.send({
                    success: true,
                    message: 'List of foods',
                    restaurant: resp
                })
            }).catch((resp) => {
                res.send({
                    success: false,
                    message: resp
                })
            })

        })

        router.post('/login', (req, res) => {
            //console.log(req.body)

            // clearCookie('userCookie')
            this.restaurantBusiness.login({
                password: req.body.password,
                cnpj: req.body.cnpj
            }).then((resp) => {
                if (resp) {
                    var jwtSecret = 'SECRET'
                    var token = jwt.sign(resp.toJSON(), jwtSecret, {
                        expiresIn: 3000
                    })
                    this.restaurantBusiness.setOnline(resp.cnpj, true)
                    res.cookie('restaurantCookie', {
                            token: token,
                            restaurant: {
                                name: resp.name,
                                cnpj: resp.cnpj,
                                email: resp.email,
                                tel: resp.tel,
                                localization: resp.localization
                            }
                        })
                        //res.redirect('home')
                        //res.sendFile(this.pagesDir + '/restaurant/profile.html')
                    res.redirect('/api/restaurant/profile')
                } else {
                    res.cookie('restaurantCookie', {
                        token: null,
                        restaurant: null
                    })
                    res.send({
                        success: false,
                        message: 'CNPJ ou senha inválidos!',
                        token: null
                    })
                }
            })
        })

        router.post('/insert', (req, res) => {
            this.restaurantBusiness.insert({
                cnpj: req.body.cnpj,
                name: req.body.name,
                password: req.body.password,
                tel: req.body.tel,
                email: req.body.email,
                localization: req.body.localization
            }).then((resp) => {
                res.redirect('/restaurant/login')
            })
        })

        router.get('/findAllOnline', (req, res) => {
            this.restaurantBusiness.findAllRestaurantsOnline().then((resp) => {
                res.send(resp)
            })
        })

        router.use((req, res, next) => {
            var token = req.cookies.restaurantCookie.token // req.body.token || req.query.token || req.headers['x-access-token']
            if (token) {
                var jwtSecret = 'SECRET'
                jwt.verify(token, jwtSecret, (err, decoded) => {
                    if (err) {
                        res.cookie('restaurantCookie', {
                            token: null,
                            restaurant: null
                        })

                        return res.redirect('/restaurant/login')
                    } else {
                        // se tudo correr bem, salver a requisição para o uso em outras rotas
                        req.decoded = decoded
                        next()
                    }
                })
            } else {
                // se não tiver o token, retornar o erro 403
                res.cookie('restaurantCookie', {
                    token: null,
                    restaurant: null
                })

                return res.redirect('/restaurant/login')
            }
        })

        router.get('/profile', (req, res) => {
            res.sendFile(this.pagesDir + '/restaurant/profile.html')
        })

        router.get('/addFood', (req, res) => {
            res.sendFile(this.pagesDir + '/restaurant/newFood.html')
        })

        router.get('/findAll', (req, res) => {
            this.restaurantBusiness.findAllRestaurants().then((resp) => {
                res.send(resp)
            })
        })

        router.get('/findFoodOrder', (req, res) => {
            var restaurantOn = req.cookies.restaurantCookie.restaurant
            var cnpj = restaurantOn.cnpj
            this.restaurantBusiness.findFoodOrder(cnpj, false).then((resp) => {
                res.send(resp)
            })
        })

        router.post('/insertFood', (req, res) => {
            var restaurantOn = req.cookies.restaurantCookie.restaurant
            var cnpj = restaurantOn.cnpj
            var food = req.body.foodName
            this.restaurantBusiness.addFood(cnpj, food)
            res.redirect('/api/restaurant/addFood')
        })

        router.get('/logout', (req, res) => {
            var restaurantOn = req.cookies.restaurantCookie.restaurant
            this.restaurantBusiness.setOnline(restaurantOn.cnpj, false)
            res.cookie('restaurantCookie', {
                token: null
            })
            res.redirect('/restaurant/login')
        })

        router.get('/home', (req, res) => {
            var restaurantOn = req.cookies.restaurantCookie.restaurant
            res.send({
                success: true,
                message: 'Welcome',
                profile: restaurantOn
            })
        })
    }
}
module.exports = RouterRestaurant