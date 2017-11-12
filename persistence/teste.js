var con = require('./ConnectionDB')
var UserRepository = require('./UserRepository');

(async() => {
    try {

        var uRep = new UserRepository(con);

        username = 'dayvid'
        password = '12345678'
        await uRep.insert({
            username,
            password
        })

        //await uRep.remove(password)


    } catch (err) {
        console.log('Log >>' + err)
    }
})()