class FoodSaleBusiness {
    constructor(restaurantRespository) {
        this.repository = restaurantRespository;
    }

    async insert(cpf, cnpj, food) {
        return new Promise((resolve, reject) => {
            var foodExits = false
            var retorno = null
            var dateTemp = new Date()
            try {
                this.repository.insert({
                    date: dateTemp,
                    cpfUser: cpf,
                    cnpjRestaurant: cnpj,
                    food: food,
                    done: false
                }).then((u) => {
                    resolve(u)
                })
            } catch (error) {
                console.log(error)
            }
        })
    }

    async setDone(cpf, cnpj, mode) {
        try {
            await this.repository.setDone(cpf, cnj, mode)
        } catch (error) {
            throw new Error(error)
        }
    }

    async findAllFoods(cnpj) {
        return new Promise((resolve, reject) => {
            try {
                this.repository.findAllFoods(cnpj).then((res) => {
                    //console.log(res)
                    resolve(res)
                })

            } catch (error) {
                throw new Error(error)
            }
        })
    }

}

module.exports = FoodSaleBusiness