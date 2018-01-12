const db = require('../api/persistence/ConnectionDB')

db.then(() => {
    console.log('MONGO CONNECTIONS(SUCESS)')
}).catch(() => {
    console.log('MONGO CONNECTIONS(ERROR)')
    process.exit(1)
})

const FoodSaleRepository = require('../api/persistence/FoodSaleRepository')
const FoodSaleBusiness = require('../api/business/FoodSaleBusiness')
const RestaurantRepository = require('../api/persistence/RestaurantRepository')
const RestaurantBusiness = require('../api/business/RestaurantBusiness')
const UserRepository = require('../api/persistence/UserRepository')
const UserBusiness = require('../api/business/UserBusiness')
const RouterRestaurant = require('../api/routes/routerRestaurant')
const RouterUser = require('../api/routes/RouterUser')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()

const publicDir = path.join(__dirname, '/public')
const scriptsDir = path.join(publicDir, '/scripts')
const pagesDir = path.join(publicDir, '/views/pages')
const imagesDir = path.join(publicDir, '/views/images')
const distDir = path.join(publicDir, '/dist')
const componentsDir = path.join(publicDir, '/components')
const assetsDir = path.join(publicDir, '/assets')

app.use('/static/', express.static(publicDir))
app.use('/pages/', express.static(pagesDir))
app.use('/images/', express.static(imagesDir))
app.use('/scripts/', express.static(scriptsDir))
app.use('/dist/', express.static(distDir))
app.use('/assets/', express.static(assetsDir))
app.use('/components/', express.static(componentsDir))
app.use(cookieParser())

const fRep = new FoodSaleRepository(db)
const foodSaleBusiness = new FoodSaleBusiness(fRep)

const rRep = new RestaurantRepository(db)
const restaurantBusiness = new RestaurantBusiness(rRep)
const routerRestaurant = new RouterRestaurant(restaurantBusiness, pagesDir)

const uRep = new UserRepository(db)
const userBusiness = new UserBusiness(uRep)
const routerUser = new RouterUser(userBusiness, pagesDir, foodSaleBusiness)

app.use('/api/user', routerUser.router)
app.use('/api/restaurant', routerRestaurant.router)

app.use('/user/login', (req, res) => {
    var tokena
    try {
        tokena = req.cookies.userCookie.token
    } catch (ERROR) {
        res.cookie('userCookie', {
            token: null,
            user: null
        })
    }

    if (tokena) {
        res.redirect('/api/user/profile')

    } else {
        res.sendFile(pagesDir + '/user/sign-in.html')
    }
})

app.use('/user/register', (req, res) => {
    res.sendFile(pagesDir + '/user/sign-up.html')
})

app.use('/user/forgot', (req, res) => {
    res.sendFile(pagesDir + '/user/forgot-password.html')
})

app.use('/restaurant/login', (req, res) => {
    var tokena
    try {
        tokena = req.cookies.restaurantCookie.token
    } catch (ERROR) {
        res.cookie('restaurantCookie', {
            token: null,
            restaurant: null
        })
    } // req.body.token || req.query.token || req.headers['x-access-token']
    if (tokena) {
        res.redirect('/api/restaurant/profile')

    } else {
        res.sendFile(pagesDir + '/restaurant/sign-in.html')
    }

})

app.use('/restaurant/register', (req, res) => {
    res.sendFile(pagesDir + '/restaurant/sign-up.html')
})

app.use('/restaurant/forgot', (req, res) => {
    res.sendFile(pagesDir + '/restaurant/forgot-password.html')
})

app.use('/signin', (req, res) => {
    res.sendFile(publicDir + '/restusersigin.html')
})

app.use('/signup', (req, res) => {
    res.sendFile(publicDir + '/restusersigup.html')
})

app.use('/', (req, res) => {
    res.sendFile(publicDir + '/homepage.html')
})

module.exports = app