var app = require('./App')
var port = process.env.PORT || 3000

var server = app.listen(port, (err, res) => {
    var error = ''
    if (err) {
        console.log('Server Connection ERROR')
        error = err
        return
    }
    console.log('Server Connection SUCESS Started on: ' + port)
    if (error !== '') {
        throw new Error(error)
    }
})

module.exports = server