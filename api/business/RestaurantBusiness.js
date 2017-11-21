var bcrypt = require('bcrypt');

class RestaurantBusiness {
    constructor(restaurantRespository) {
        this.repository = restaurantRespository;
    }

    async insert(restaurant) {
        return new Promise((resolve, reject) => {
            var restaurantExist = false
            var retorno = null
            try {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(restaurant.password, salt)
                this.repository.findByCnpj(restaurant.cpf).catch((error) => {
                    //console.log(error)
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
                console.log(error)
            }
        })
    }

    async findAllRestaurants() {
        return new Promise((resolve, reject) => {
            try {
                this.repository.findAll().then((res) => {
                    //console.log(res)
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
                var senha = false
                var cnpj = false
                this.repository.findByCnpj(restaurant.cnpj).then((res) => {
                    var foi = bcrypt.compareSync(restaurant.password, res.password);
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
                    //console.log(res)
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
            var date = new Date('yyyy-mm-dd')
            try {
                this.repository.findFoodOrder(cnpj, date, mode).then((res) => {
                    resolve(res)
                })
            } catch (err) {
                console.log(err)
            }

        })
    }

    async findFoodOrderAll(cnpj) {
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

}

module.exports = RestaurantBusiness