const mongoose = require('mongoose')
const dbconfig = require('../config/db.json')
let mongoConn = null

mongoose.Promise = global.Promise;

(() => {
    let error = ''
    const url = 'mongodb://' + dbconfig.address + ':' + dbconfig.port + '/' + dbconfig.db
    mongoConn = mongoose.connect(url, { useMongoClient: true }, (err) => {
        if (err) {
            error = err
        }
    })
    if (error !== '') {
        throw Error('erro no db')
    }
})()
module.exports = mongoConn