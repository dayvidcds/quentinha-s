var app = require('./App')
var port = process.env.PORT || 80
var host = '192.168.0.105'

var server = app.listen(port, (err, res) => {
    var error = ''
    var host = server.address().address;
    var port = server.address().port;
    if (err) {
        console.log('Server Connection ERROR')
        error = err
        return
    }
    console.log('Server Connection SUCESS Started on: http://' + host + ':' + port)
    if (error !== '') {
        throw new Error(error)
    }
})

module.exports = server