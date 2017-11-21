const db = require('/api/persistence/ConnectionDB')
const RestaurantRepository = require('/api/persistence/RestaurantRepository')
const RestaurantBusiness = require('/api/business/RestaurantBusiness')
const bodyParser = require('body-parser')
const express = require('express')
const routerAPIUser = require('./api/routes/RouterUser')
const routerAPIRestaurant = require('./api/routes/RouterRestaurant')

const routerRestaurant = express.Router()
//routerRestaurant.use(bodyParser.urlencoded({ extended: true }))
routerRestaurant.use(bodyParser.json())

const app = express()
const path = require('path')

const publicDir = path.join(__dirname, '/public')
const scriptsDir = path.join(publicDir, '/scripts')
const pagesDir = path.join(publicDir, '/views/pages')
const imagesDir = path.join(publicDir, '/views/images')
const apiDir = path.join(__dirname, '/api')

const routerUserStatic = express.Router()
routerUserStatic.use(bodyParser.json())
const routerRestaurantStatic = express.Router()
routerRestaurantStatic.use(bodyParser.json())

app.use('/static/', express.static(publicDir))
app.use('/pages/', express.static(pagesDir))
app.use('/images/', express.static(imagesDir))
app.use('/scripts/', express.static(scriptsDir))

app.use('/api/user', routerAPIUser)
app.use('/api/restaurant', routerAPIRestaurant)
app.use('/user/', routerUserStatic)


routerUserStatic.get('/', (req, res) => {
	res.sendFile(pagesDir + '/index.html')
})

routerUserStatic.get('/login', (req, res) => {
	res.sendFile(pagesDir + '/sign-in.html')
})

routerUserStatic.get('/register', (req, res) => {
	res.sendFile(pagesDir + '/sign-up.html')
})

routerUserStatic.get('/logout', (req, res) => {
	res.sendFile(pagesDir + '/index.html')
})

routerUserStatic.get('/forgot', (req, res) => {
	res.sendFile(pagesDir + '/forgot-password.html')
})

app.use('/api', (req, res) => {
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


const rRep = new RestaurantRepository(db)
const restaurantBusiness = new RestaurantBusiness(rRep)


module.exports = app