var mongoose = require('mongoose')

class UserRepository {
    constructor(connection) {
        this.connection = connection
        this.schema = new mongoose.Schema({
            cpf: String,
            name: String,
            password: String,
            tel: String,
            email: String,
            connected: Boolean
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
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    async setOnline(cpf, mode) {
        //return Promise.all()
        var error = ''
        await this.userModel.findOneAndUpdate({ cpf: cpf }, { $set: { connected: mode } },
            (err, res) => {
                if (err) {
                    error = err
                }
            })
        if (error != '') {
            throw new Error(error)
        }
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
            //console.log('entrou')
            var result = null
            var error = ''
            this.userModel.find((err, res) => {
                    if (err) {
                        error = err
                        reject(error)
                    }
                    //console.log(res)
                    resolve(res)
                        //result = res
                })
                //return result	
        });
    }

    async findByCpf(cpf) {
        return new Promise((resolve, reject) => {
            var error = ''
            var result = null
            this.userModel.findOne({ cpf: cpf }, (err, res) => {
                if (err || (res == null)) {
                    error = err
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    async findByPassword(password) {
        return new Promise((resolve, reject) => {
            var error = ''
            var result = null
            this.userModel.findOne({ password: password }, (err, res) => {
                if (err || (res == null)) {
                    error = err
                    reject(err)
                }
                resolve(res)
            })
        })

    }
}

module.exports = UserRepository