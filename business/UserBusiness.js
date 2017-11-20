var bcrypt = require('bcrypt');

class UserBusiness {
    constructor(userRepository) {
        this.repository = userRepository;
    }

    checkCpf(cpf) {
        if (cpf == null) throw new Error('Null CPF')
    }

    checkName(name) {
        if (name == null) throw new Error('Null name')
    }

    async insert(user) {
        //checkName(user.name)
        //checkCpf(user.cpf)
        return new Promise((resolve, reject) => {
            var userExist = false
            var retorno = null
            try {
                this.checkCpf(user.cpf)
                this.checkName(user.name)
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(user.password, salt)
                this.repository.findByCpf(user.cpf).catch((error) => {
                    //console.log(error)
                    this.repository.insert({
                        cpf: user.cpf,
                        name: user.name,
                        password: hash,
                        tel: user.tel,
                        email: user.email,
                        connected: false
                    }).then((u) => {
                        resolve(u)
                    })
                })
            } catch (error) {
                console.log(error)
            }
        })
    }

    async findAllUsers() {
        return new Promise((resolve, reject) => {
            try {
                this.repository.findAll().then((res) => {
                    //console.log(res)
                    resolve(res)
                })

            } catch (error) {
                throw new Error(error)
            }
        })
    }

    async remove(password) {
        try {
            await this.repository.findByPassword(password).then((res) => {
                this.repository.remove(password)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async setOnline(cpf, mode) {
        try {
            this.checkCpf(cpf)
            await this.repository.findByCpf(cpf)
            await this.repository.setOnline(cpf, mode)
        } catch (error) {
            throw new Error(error)
        }
    }

    async login(user) {
        return new Promise((resolve, reject) => {
            try {
                var senha = false
                var cpf = false
                this.repository.findByCpf(user.cpf).then((res) => {
                    var foi = bcrypt.compareSync(user.password, res.password);
                    if (foi === true) {
                        resolve(res)
                    } else {
                        resolve(null)
                    }
                })

            } catch (error) {
                console.log(error)
            }
        })
    }

    async findRestaurantsOnline() {
        return new Promise((resolve, reject) => {
            var error = ''
            var result = null
            try {
                this.repository.findRestaurantsOnline().then((res) => {
                    resolve(res)
                })
            } catch (err) {
                console.log(err)
            }

        })
    }

}

module.exports = UserBusiness