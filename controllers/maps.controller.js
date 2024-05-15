const wrapper = require('../utils/wrapper');
const mapsService = require('../service/maps.service')

exports.getMaps = async (req, res) => {
    try {
        const payload = req.params.input

        console.log(payload);
        const result = await mapsService.getMaps(payload)
        if (!result.isSuccess) {
            return wrapper.responseErrors(res, 'maps areas not found', 404, null)
        }
        return wrapper.responseSuccess(res, 'success get map areas', result.data, 200)

    } catch (error) {
        console.log(error);
        return wrapper.responseErrors(res, 'failed to get map areas, internal error', 500, error)
    }
}