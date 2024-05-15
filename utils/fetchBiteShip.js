const { default: axios } = require("axios")

exports.fetchBiteShip = async ({
    path,
    method,
    body = null,
    headers = null,
    query = ''
}) => {
    const BITESHIP_BASE_URL = process.env.BITESHIP_BASE_URL
    const BITESHIP_TOKEN = process.env.BITESHIP_TOKEN

    const url = `${BITESHIP_BASE_URL}${path}?${query}`

    try {
        const response = await axios({
        method,
            url,
            headers: {
                'Authorization': `Bearer ${BITESHIP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            data: body,
        })
        console.log(response);
        const data = response.data
        return data
    } catch (error) {
        console.log(error);
        return error.response.data
    }
}