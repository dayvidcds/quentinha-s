const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(cookieParser())

class RouterUser {
  constructor (userBusiness) {
    this.userBusiness = userBusiness
    this.initializeRoutes()
    this.router = router
  }

  initializeRoutes () {
    router.post('/login', (req, res) => {
      console.log(req.body)

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
          res.redirect('home')
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
        res.send(resp)
      })
    })

    router.use((req, res, next) => {
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
          	// se tudo correr bem, salver a requisição para o uso em outras rotas
            req.decoded = decoded
            next()
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
      res.send({
        success: true,
        message: 'Token liberado!'
      })
    })

    router.get('/home', (req, res) => {
      var userOn = req.cookies.userCookie.user
      res.send({
        success: true,
        message: 'Welcome',
        user: userOn
      })
    })

    router.post('/askFood', (req, res) => {
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

    router.get('/restaurantsOnline', (req, res) => {
      this.userBusiness.findRestaurantsOnline().then((resp) => {
        res.send(resp)
      })
    })
  }
}
module.exports = RouterUser
