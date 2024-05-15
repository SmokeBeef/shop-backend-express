const wraper = require('../utils/wrapper')
const courierService = require('../service/courier.service')
exports.getCourier = async (req, res) => {
    try {
        const result = await courierService.getCouriers()
        return wraper.responseSuccess(res, 'success get couriers', result.data, 200)
    } catch (error) {
        return wraper.responseErrors(res, 'failed get couriers, internal error', 500, error)
    }
}