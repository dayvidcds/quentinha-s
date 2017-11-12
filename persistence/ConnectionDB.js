var mongoose = require('mongoose')
var dbconfig = require('../config/db.json')
var mongoConn

mongoose.Promise = global.Promise;

(() => {
    var url
    var error = ''
    url = 'mongodb://' + dbconfig.address + ':' + dbconfig.port + '/' + dbconfig.db
    mongoConn = mongoose.connect(url, (err, res) => {
        if (err) {
            console.log('MONGO CONNECTIONS(ERROR)')
            error = err
            return
        }
        console.log('MONGO CONNECTIONS(SUCESS)')
    })
    if (error !== '') {
        throw new Error(error)
    }
})()

module.exports = mongoConn