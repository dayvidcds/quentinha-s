var mongoose = require('mongoose')

class FoodSaleRepository {
    constructor(connection) {
        this.connection = connection
        this.schema = new mongoose.Schema({
            date: Date,
            cpfUser: String,
            cnpjRestaurant: String,
            food: [String],
            done: Boolean
        })
        this.foodModel = this.connection.model('FoodSale', this.schema)
    }

    async insert(food) {
        return new Promise((resolve, reject) => {
            var error = ''
            var foodRep = new this.foodModel(food);
            foodRep.save((err, res) => {
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

    async setDone(cpf, cnpj, mode) {
        //return Promise.all()
        var error = ''
        await this.userModel.findOneAndUpdate({ cpf: cpf, cnpj: cnpj }, { $set: { done: mode } },
            (err, res) => {
                if (err) {
                    error = err
                }
            })
        if (error != '') {
            throw new Error(error)
        }
    }

    async findAllFoods(cnpj) {
        return new Promise((resolve, reject) => {
            var result = null
            var error = ''
            this.restaurantModel.find({ cnpj: cnpj }, (err, res) => {
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

    async findAllFoodsDone(cnpj) {
        return new Promise((resolve, reject) => {
            var result = null
            var error = ''
            this.restaurantModel.find({ cnpj: cnpj, done: true }, (err, res) => {
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

}

module.exports = FoodSaleRepository