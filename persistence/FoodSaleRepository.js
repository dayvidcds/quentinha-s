var mongoose = require('mongoose')

class FoodSaleRepository {
    constructor(connection) {
        this.connection = connection
        this.schema = new mongoose.Schema({
            cpfUser: String,
            cnpjRestaurant: String,
            food: [String]
        })
        this.foodModel = this.connection.model('FoodSale', this.schema)
    }

    async insert(food) {
        return new Promise((resolve, reject) => {
            var error = ''
            var foodRep = new this.userModel(food);
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

}

module.exports = FoodSaleRepository