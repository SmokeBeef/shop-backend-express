const { fetchBiteShip } = require('../utils/fetchBiteShip')
const { queryParams } = require('../utils/queryParam')
const wrapper = require('../utils/wrapper')

exports.getMaps = async (input) => {
    const query = queryParams({
        input,
        countries: 'ID',
        type: 'single'
    })
    console.log(query);
    const result = await fetchBiteShip({ path: '/maps/areas', method: 'GET', query })


    return wrapper.data(result.areas)
}