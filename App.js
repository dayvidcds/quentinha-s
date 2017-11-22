const db = require('./api/persistence/ConnectionDB')

db.then(() => {
    console.log('MONGO CONNECTIONS(SUCESS)')
}).catch(() => {
    console.log('MONGO CONNECTIONS(ERROR)')
    process.exit(1)
})

const RestaurantRepository = require('./api/persistence/RestaurantRepository')
const RestaurantBusiness = require('./api/business/RestaurantBusiness')
const UserRepository = require('./api/persistence/UserRepository')
const UserBusiness = require('./api/business/UserBusiness')
const RouterRestaurant = require('./api/routes/routerRestaurant')
const RouterUser = require('./api/routes/RouterUser')
const express = require('express')
const path = require('path')

const app = express()

const rRep = new RestaurantRepository(db)
const restaurantBusiness = new RestaurantBusiness(rRep)
const routerRestaurant = new RouterRestaurant(restaurantBusiness)

const uRep = new UserRepository(db)
const userBusiness = new UserBusiness(uRep)
const routerUser = new RouterUser(userBusiness)

app.use('/user', routerUser.router)
app.use('/restaurant', routerRestaurant.router)

app.use('/', (req, res) => {
    res.send({
        success: true,
        message: 'Welcome to the API',
        routes: [{
            insert_user: 'host/user/insert',
            login_user: 'host/user/login (require: cpf, name, password, tel, email)',
            home_user: 'host/user/home',
            logout_user: 'host/user/logout',
            insert_restaurant: 'host/restaurant/insert',
            login_restaurant: 'host/restaurant/login (require: cpf, name, password, tel, email)',
            home_restaurant: 'host/restaurant/home',
            logout_user: 'host/restaurant/logout'
        }]
    })
})

module.exports = app