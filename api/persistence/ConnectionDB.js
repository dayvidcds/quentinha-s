const mongoose = require('mongoose')
const dbconfig = require('../config/db.json')
let mongoConn = null

mongoose.Promise = global.Promise;
mongodb:

    (() => {
        let error = ''
        const url = 'mongodb://dayvidcds:dayvid12344223@ds117858.mlab.com:17858/quentinhas' //'mongodb://' + dbconfig.address + ':' + dbconfig.port + '/' + dbconfig.db //const url = 'mongodb://dayvidcds:dayvid12344223@ds259245.mlab.com:59245/databasequentinhas'
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