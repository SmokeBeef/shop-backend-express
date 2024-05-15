const { PrismaClient } = require('@prisma/client');
const wrapper = require('../utils/wrapper');
const { fetchBiteShip } = require('../utils/fetchBiteShip');

const db = new PrismaClient()


exports.createOrder = async (data) => {

    const firstData = data.items[0]

    let product_ids = []

    data.items.forEach(item => {
        if (firstData.shop_id !== item.shop_id)
            return wrapper.data(null, 'failed create order, product shop must be same')
        product_ids.push(item.product_id)
    })
    const shop = await db.shops.findUnique({
        where: {
            id: firstData.shop_id
        },
        include: {
            user: true
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
        origin_contact_name: shop.name,
        origin_contact_phone: shop.phone_number,
        origin_contact_email: shop.user.email,
        origin_address: shop.address,
        origin_postal_code: Number(shop.postal_code),
        destination_contact_name: data.name,
        destination_contact_phone: data.phone,
        destination_address: data.address,
        destination_postal_code: data.postal_code,
        courier_company: data.courier,
        courier_type: 'reg',
        delivery_type: 'now',
        metadata: {},
        items: products.map((item, index) => ({
            name: item.name,
            value: data.items[index].product_type_id ? item.product_types.find(val => val.id === data.items[index].product_type_id).price : item.price,
            quantity: data.items[index].quantity,
            weight: item.weight,
        }))
    }

    const result = await fetchBiteShip({
        method: 'POST',
        path: '/orders',
        body: payload
    })

    console.log(payload);
    console.info(result);

    const resultData = {
        invoice: result.id,
        shipper: result.shipper,
        origin: result.origin,
        destination: result.destination,
        courier: result.courier,
        delivery: result.delivery,
        items: result.items,
        extra: result.extra,
        price: result.price,
        metadata: result.metadata,
        note: result.note,
        status: result.status,
    }

    if(!result.id) {
        return wrapper.data(null, 'there is error')
    }

    const totalPrice = payload.items.reduce((prev, item) => prev + (item.quantity * item.value), 0) + result.price
    
    const order = await db.orders.create({
        data: {
            user_id: data.user_id,
            data: JSON.stringify(resultData),
            invoice: resultData.invoice,
            total_ammount: totalPrice

        }
    })
    resultData.id = order.id
    return result.id ? wrapper.data(resultData) : wrapper.data(null, 'there is error')
}


exports.getUserOrder = async (userId) => {

    const result = await db.orders.findMany({
        where: {
            user_id: userId
        },
        include: {
            detail_orders: {
                include: {
                    product: true,
                    product_type: true,
                }
            },
        }
    })

    const data = result.map((val) => ({
        ...val,
        data: JSON.parse(val.data)
    }));

    return wrapper.data(data);

}

exports.uploadProof = async (data) => {

    const isOrderExist = await db.orders.findFirst({
        where: {
            user_id: data.user_id,
            id: data.order_id
        }
    })

    if (!isOrderExist)
        return wrapper.data(null, 'failed update, your order not found')

    const result = await db.orders.update({
        where: {
            user_id: data.user_id,
            id: data.order_id
        },
        data: {
            proof: data.proof
        }
    })


    return wrapper.data(result);
}


exports.cancelOrder = async (data) => {

    const order = await db.orders.findFirst({
        where: {
            user_id: data.user_id,
            id: data.order_id
        }
    })

    if (!order)
        return wrapper.data(null, 'failed cancel, your order not found')


    const dataOrder = JSON.parse(order.data)

    const result = await fetchBiteShip({
        method: "DELETE",
        path: 'orders/' + dataOrder.id,
    })

    await db.orders.delete({
        where: {
            user_id: data.user_id,
            id: data.order_id
        }
    })

    return wrapper.data(result);
}

exports.orderTrack = async (data) => {

    const order = await db.orders.findFirst({
        where: {
            user_id: data.user_id,
            id: data.order_id
        }
    })
    if (!order)
        return wrapper.data(null, 'failed track, your order not found')

    const courier = JSON.parse(order.data).courier
    const response = await fetchBiteShip({
        method: "GET",
        path: '/trackings/' + courier.waybill_id + '/couriers/' + courier.company,
    })
    console.log(response);
    console.log(courier);

    const dataTracker = {
        history: response.history,
        origin: response.origin,
        status: response.status,
        destination: response.destination,
        courier: response.courier,
    }

    return wrapper.data(dataTracker)
}