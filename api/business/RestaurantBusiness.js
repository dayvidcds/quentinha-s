const bcrypt = require('bcrypt')

class RestaurantBusiness {
    constructor(restaurantRespository) {
        this.repository = restaurantRespository
    }

    async insert(restaurant) {
        return new Promise((resolve, reject) => {
            try {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(restaurant.password, salt)
                this.repository.findByCnpj(restaurant.cpf).catch((error) => {
                    // console.log(error)
                    this.repository.insert({
                        cnpj: restaurant.cnpj,
                        name: restaurant.name,
                        password: hash,
                        tel: restaurant.tel,
                        email: restaurant.email,
                        localization: restaurant.localization,
                        connected: false
                    }).then((u) => {
                        resolve(u)
                    })
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    async findAllRestaurants() {
        return new Promise((resolve, reject) => {
            try {
                this.repository.findAll().then((res) => {
                    // console.log(res)
                    resolve(res)
                })
            } catch (error) {
                throw new Error(error)
            }
        })
    }

    async login(restaurant) {
        return new Promise((resolve, reject) => {
            try {
                this.repository.findByCnpj(restaurant.cnpj).then((res) => {
                    var foi = bcrypt.compareSync(restaurant.password, res.password)
                    if (foi === true) {
                        resolve(res)
                    } else {
                        resolve(null)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        })
    }

    async setOnline(cnpj, mode) {
        try {
            await this.repository.findByCnpj(cnpj)
            await this.repository.setOnline(cnpj, mode)
        } catch (error) {
            throw new Error(error)
        }
    }

    async findAllRestaurantsOnline() {
        return new Promise((resolve, reject) => {
            try {
                this.repository.findAllOnline().then((res) => {
                    // console.log(res)
                    resolve(res)
                })
            } catch (error) {
                throw new Error(error)
            }
        })
    }

    async addFood(cnpj, food) {
        try {
            await this.repository.findByCnpj(cnpj)
            await this.repository.addFood(cnpj, food)
        } catch (error) {
            throw new Error(error)
        }
    }

    async findFoodOrder(cnpj, mode) {
        return new Promise((resolve, reject) => {
            try {
                const dateNow = new Date()
                const dateNowUTF3 = new Date(dateNow.getTime() - (dateNow.getTimezoneOffset() * 60000))
                const formattedDate = dateNowUTF3.toISOString().split('T')[0]
                this.repository.findFoodOrder(cnpj, formattedDate, mode).then((res) => {
                    resolve(res)
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    async findAllFoodOrder(cnpj) {
        return new Promise((resolve, reject) => {
            try {
                this.repository.findFoodOrderAll(cnpj).then((res) => {
                    resolve(res)
                })
            } catch (err) {
                console.log(err)
            }
        })
    }

    async findFoods(cnpj) {
        //console.log(cnpj)
        return new Promise((resolve, reject) => {
            try {
                this.repository.findFoods(cnpj).then((resp) => {
                    // console.log(resp)
                    var restaurant = {
                        name: resp[0].name,
                        cnpjRestaurant: resp[0].cnpj,
                        email: resp[0].email,
                        tel: resp[0].tel,
                        localization: resp[0].localization,
                        foods: resp[0].listOfFoods
                    }
                    resolve(restaurant)
                })
            } catch (err) {
                console.log(err)
            }
        })
    }
}

module.exports = RestaurantBusiness