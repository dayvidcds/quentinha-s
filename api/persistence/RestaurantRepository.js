const mongoose = require('mongoose')

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
        this.RestaurantModel = this.connection.model('Restaurant', this.schema)
    }

    async insert(restaurant) {
        return new Promise((resolve, reject) => {
            const restaurantRep = new this.RestaurantModel(restaurant)
            restaurantRep.save((err, res) => {
                if (err) {
                    reject(res)
                }
                resolve(res)
            })
        })
    }

    async findByCnpj(cnpj) {
        return new Promise((resolve, reject) => {
            this.RestaurantModel.findOne({ cnpj: cnpj }, (err, res) => {
                if (err || (res === null)) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            this.RestaurantModel.find((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    async findAllOnline() {
        return new Promise((resolve, reject) => {
            this.RestaurantModel.find({ connected: true }, {
                    _id: 0,
                    cnpj: 1,
                    name: 1,
                    tel: 1,
                    email: 1,
                    localization: 1
                },
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                })
        })
    }

    async setOnline(cnpj, mode) {
        this.RestaurantModel.findOneAndUpdate({ cnpj: cnpj }, { $set: { connected: mode } },
            (err, doc) => {
                if (err) {
                    throw new Error(err)
                }
            })
    }

    async addFood(cnpj, food) {
        this.RestaurantModel.findOneAndUpdate({ cnpj: cnpj }, { $push: { listOfFoods: food } }, (err, res) => {
            if (err) {
                throw new Error(err)
            }
        })
    }

    async findFoodOrder(cnpj, date, status) {
        return new Promise((resolve, reject) => {
            this.RestaurantModel.aggregate([{
                $match: {
                    cnpj: cnpj
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
                    'sales_full.date': {
                        $gte: new Date(date)
                    },
                    'sales_full.done': status
                }
            }, {
                $group: {
                    _id: '$sales_full.cpfUser',
                    food: {
                        $push: '$sales_full.food'
                    }
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

    async findAllFoodOrder(cnpj) {
        return new Promise((resolve, reject) => {
            this.RestaurantModel.aggregate([{
                    $match: {
                        cnpj: cnpj
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
                },
                {
                    $group: {
                        _id: '$sales_full.cpfUser',
                        food: {
                            $push: {
                                food: '$sales_full.food',
                                date: '$sales_full.date'
                            }
                        }
                    }
                }
            ], (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    async findFoods(cnpj) {
        return new Promise((resolve, reject) => {
            this.RestaurantModel.find({ cnpj: cnpj }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

}
module.exports = RestaurantRepository