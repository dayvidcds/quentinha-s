const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('../api/persistence/ConnectionDB');
const RestaurantRepository = require('../api/persistence/RestaurantRepository');
const RestaurantBusiness = require('../api/business/RestaurantBusiness');

const routerRestaurant = express.Router();
//routerRestaurant.use(bodyParser.urlencoded({ extended: true }));
routerRestaurant.use(bodyParser.json());
routerRestaurant.use(cookieParser());

class RouterRestaurant{
	constructor(restaurantBusiness) {
		this.restaurantBusiness = restaurantBusiness
		this.initializeRoutes()
	}
	
	async function initializeRoutes(){
		routerRestaurant.post('/login', (req, res) => {
		// clearCookie('userCookie')
		restaurantBusiness.login({
			password: req.body.password,
			cnpj: req.body.cnpj
		}).then((resp) => {
			if (resp) {
				var jwtSecret = 'SECRET'
				var token = jwt.sign(resp.toJSON(), jwtSecret, {
					expiresIn: 1440
				})
				restaurantBusiness.setOnline(resp.cnpj, true)
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
				res.redirect('/restaurant/home')
			} else {
				res.cookie('restaurantCookie', {
					token: null,
					restaurant: null
				})
				res.json({
					success: false,
					message: 'CNPJ ou senha inválidos!',
					token: null
				})
			}
		})
	})

	routerRestaurant.post('/insert', (req, res) => {
		restaurantBusiness.insert({
			cnpj: req.body.cnpj,
			name: req.body.name,
			password: req.body.password,
			tel: req.body.tel,
			email: req.body.email,
			localization: req.body.localization
		}).then((resp) => {
			res.send(resp)
		})
	})

	routerRestaurant.get('/findAllOnline', (req, res) => {
		restaurantBusiness.findAllRestaurantsOnline().then((resp) => {
			res.send(resp)
		})
	})

	routerRestaurant.use((req, res, next) => {
		var token = req.cookies.restaurantCookie.token // req.body.token || req.query.token || req.headers['x-access-token']
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


	routerRestaurant.get('/findAll', (req, res) => {
		restaurantBusiness.findAllRestaurants().then((resp) => {
			res.send(resp)
		})
	})

	routerRestaurant.get('/findFoodOrder', (req, res) => {
		var restaurantOn = req.cookies.restaurantCookie.restaurant
		var cnpj = restaurantOn.cnpj
		restaurantBusiness.findFoodOrder(cnpj).then((resp) => {
			res.send(resp)
		})
	})

	routerRestaurant.post('/insertFood', (req, res) => {
		var cnpj = req.body.cnpj
		var food = req.body.foodName
		restaurantBusiness.addFood(cnpj, food)
		res.send({
			success: true,
			message: 'Insert to database',
		})
	})

	routerRestaurant.get('/logout', (req, res) => {
		var restaurantOn = req.cookies.restaurantCookie.restaurant
		restaurantBusiness.setOnline(restaurantOn.cnpj, false)
		res.cookie('restaurantCookie', {
			token: null
		})
		res.send({
			success: true,
			message: 'Token liberado!'
		})
	})

	routerRestaurant.get('/home', (req, res) => {
		var restaurantOn = req.cookies.restaurantCookie.restaurant
		res.send({
			success: true,
			message: 'Welcome',
			restaurant: restaurantOn
		})
	})
	}
}
module.exports = routerRestaurant
