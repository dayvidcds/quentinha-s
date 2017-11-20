var mongoose = require('mongoose')

class RestaurantRepository {
    constructor(connection) {
        this.connection = connection
        this.schema = new mongoose.Schema({
            cnpj: String,
            name: String,
            password: String,
            tel: String,
            email: String,
            localization: String,
            listOfFoods: [String],
            connected: Boolean
        })
        this.restaurantModel = this.connection.model('Restaurant', this.schema)
    }

    async insert(restaurant) {
        return new Promise((resolve, reject) => {
            var error = ''
            var restaurantRep = new this.restaurantModel(restaurant);
            restaurantRep.save((err, res) => {
                if (err) {
                    error = err
                }
                if (error !== '') {
                    //throw new Error(error)
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    async findByCnpj(cnpj) {
        return new Promise((resolve, reject) => {
            var error = ''
            var result = null
            this.restaurantModel.findOne({ cnpj: cnpj }, (err, res) => {
                if (err || (res == null)) {
                    error = err
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            //console.log('entrou')
            var result = null
            var error = ''
            this.restaurantModel.find((err, res) => {
                    if (err) {
                        error = err
                        reject(error)
                    }
                    //console.log(res)
                    resolve(res)
                        //result = res
                })
                //return result	
        })
    }

    async findAllOnline() {
        return new Promise((resolve, reject) => {
            var result = null
            var error = ''
            this.restaurantModel.find({ connected: true }, (err, res) => {
                if (err) {
                    error = err
                    reject(error)
                }
                //console.log(res)
                resolve(res)
                    //result = res
            })
        })
    }

    async setOnline(cnpj, mode) {
        //return Promise.all()
        var error = ''
        await this.restaurantModel.findOneAndUpdate({ cnpj: cnpj }, { $set: { connected: mode } },
            (err, res) => {
                if (err) {
                    error = err
                }
            })
        if (error != '') {
            throw new Error(error)
        }
    }

    async addFood(cnpj, food) {
        //return Promise.all()
        var error = ''
        await this.restaurantModel.findOneAndUpdate({ cnpj: cnpj }, { $push: { listOfFoods: food } },
            (err, res) => {
                if (err) {
                    error = err
                }
            })
        if (error != '') {
            throw new Error(error)
        }
    }

    async findFoodOrder(cnpj, date) {
        return new Promise((resolve, reject) => {
            var result = null
            var error = ''
            this.restaurantModel.aggregate([{
                $match: {
                    cnpj: '123456'
                }
            }, {
                $lookup: {
                    from: 'foodsales',
                    localField: 'cnpj',
                    foreignField: 'cnpjRestaurant',
                    as: 'sales_full'
                }
            }, {
                $unwind: '$sales_full'
            }, {
                $match: {
                    'sales_full.date': { $gte: date }
                }
            }], (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

}

module.exports = RestaurantRepository