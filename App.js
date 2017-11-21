const db = require('./api/persistence/ConnectionDB')
const RestaurantRepository = require('./api/persistence/RestaurantRepository')
const RestaurantBusiness = require('./api/business/RestaurantBusiness')
const UserRepository = require('./api/persistence/UserRepository')
const UserBusiness = require('./api/business/UserBusiness')
const RouterRestaurant = require('./api/routes/routerRestaurant')
const RouterUser = require('./api/routes/RouterUser')
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')

const app = express()

const publicDir = path.join(__dirname, '/public')
const scriptsDir = path.join(publicDir, '/scripts')
const pagesDir = path.join(publicDir, '/views/pages')
const imagesDir = path.join(publicDir, '/views/images')
app.use('/static/', express.static(publicDir))
app.use('/pages/', express.static(pagesDir))
app.use('/images/', express.static(imagesDir))
app.use('/scripts/', express.static(scriptsDir))

const rRep = new RestaurantRepository(db)
const restaurantBusiness = new RestaurantBusiness(rRep)
const routerRestaurant = new RouterRestaurant(restaurantBusiness)

const uRep = new UserRepository(db);
const userBusiness = new UserBusiness(uRep);
const routerUser = new RouterUser(userBusiness)

app.use('/api/user', routerUser.router)
app.use('/api/restaurant', routerRestaurant.router)

app.use('/user/login', (req, res) => {
	res.sendFile(pagesDir + '/user/sign-in.html')
})

app.use('/user/register', (req, res) => {
	res.sendFile(pagesDir + '/user/sign-up.html')
})

app.use('/user/forgot', (req, res) => {
	res.sendFile(pagesDir + '/user/forgot-password.html')
})

app.use('/restaurant/login', (req, res) => {
	res.sendFile(pagesDir + '/restaurant/sign-in.html')
})

app.use('/restaurant/register', (req, res) => {
	res.sendFile(pagesDir + '/restaurant/sign-up.html')
})

app.use('/restaurant/forgot', (req, res) => {
	res.sendFile(pagesDir + '/restaurant/forgot-password.html')
})

app.use('/', (req, res) => {
	res.sendFile(pagesDir + '/index.html')
})

module.exports = app
