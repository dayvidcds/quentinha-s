var mongoose = require('mongoose')

class UserRepository {
    constructor(connection) {
        this.connection = connection
        this.schema = new mongoose.Schema({
            username: String,
            password: String,
        })
        this.userModel = this.connection.model('User', this.schema)
    }

    async insert(user) {
        return new Promise((resolve, reject) => {
            var error = ''
            var userRep = new this.userModel(user);
            userRep.save((err, res) => {
                if (err) {
                    error = err
                }
                if (error !== '') {
                    //throw new Error(error)
                    reject
                }
                resolve(res)
            })
        })
    }

    async remove(password) {
        var error = ''
        await this.userModel.findOneAndRemove({ password: password }, (err, res) => {
            if (err) {
                error = err
            }
        })
        if (error != '') {
            throw new Error(error)
        }
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            console.log('entrou')
            var result = null
            var error = ''
            this.userModel.find((err, res) => {
                    if (err) {
                        error = err
                        reject(error)
                    }
                    console.log(res)
                    resolve(res)
                        //result = res
                })
                //return result	
        });
    }

}

module.exports = UserRepository