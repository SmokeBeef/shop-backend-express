const { PrismaClient } = require("@prisma/client")
const { fetchBiteShip } = require("../utils/fetchBiteShip")
const wrapper = require("../utils/wrapper")
const db = new PrismaClient()
exports.getRates = async (data) => {

    const firstData = data.items[0]

    let product_ids = []

    data.items.forEach(item => {
        if (firstData.shop_id !== item.shop_id)
            return wrapper.data(null, 'failed get rates, product shop must be same')
        product_ids.push(item.product_id)
    })
    const shop = await db.shops.findUnique({
        where: {
            id: firstData.shop_id
        }
    })

    if (!shop) {
        return wrapper.data(null, 'this shop is not found')
    }

    const products = await db.products.findMany({
        where: {
            id: {
                in: product_ids,
            },
            shop_id: firstData.shop_id
        },
        include: {
            product_types: true,
        }
    })

    if (products.length !== product_ids.length)
        return wrapper.data(null, 'There are some products that don\'t exist in this shop')

    const payload = {
        origin_postal_code: Number(shop.postal_code),
        destination_postal_code: Number(data.postal_code),
        couriers: 'anteraja,jne,sicepat,jnt',
        items: products.map((item, index) => ({
            name: item.name,
            value: data.items[index].product_type_id ? item.product_types.find(val => val.id === data.items[index].product_type_id).price : item.price,
            quantity: data.items[index].quantity,
            weight: item.weight,
        }))
    }

    const result = await fetchBiteShip({
        method: 'POST',
        path: '/rates/couriers',
        body: payload,
    })
    console.info(payload)
    console.info(result)
    return wrapper.data(result.pricing)
}