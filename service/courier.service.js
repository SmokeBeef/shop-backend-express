const { fetchBiteShip } = require("../utils/fetchBiteShip")

const wrapper = require('../utils/wrapper')

exports.getCouriers = async () => {
    const result = await fetchBiteShip({
        method: 'GET',
        path: '/couriers',
    })

    return wrapper.data(result.couriers)

}