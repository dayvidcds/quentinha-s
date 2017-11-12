var db = require('../persistence/ConnectionDB')
var UserRepository = require('../persistence/UserRepository')
var UserBusiness = require('../business/UserBusiness')

var uRep = new UserRepository(db)

var userBusiness = new UserBusiness(uRep);

(async() => {
    try {
        password = 'auau1234'
            /*name = 'Dayvid'
            cpf = '123456789'
        
            userBusiness.insert({
                cpf: cpf,
                name: name,
                password: password
            }).then((resp) => {
                console.log(resp)
            })*/

        /*userBusiness.findAllUsers().then((resp) => {
            console.log(resp)
        })*/

        userBusiness.remove(
            password
        ).then((resp) => {
            console.log(resp)
        })

    } catch (err) {
        console.log('Log >>' + err)
    }
})()