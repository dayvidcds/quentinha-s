const app = require('./App')
const port = process.env.PORT || 80

const server = app.listen(port, (err, res) => {
    var error = ''
    var host = server.address().address
    var port = server.address().port
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