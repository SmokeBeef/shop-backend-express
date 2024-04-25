const { PrismaClient } = require("@prisma/client")
const wrapper = require('../utils/wrapper')
const { calcPaginate, metaData } = require("../utils/calcPaginate")

const db = new PrismaClient()

exports.createProduct = async (data) => {

    const userShop = await db.shops.findUnique({
        where: {
            user_id: data.user_id
        }
    })

    if (!userShop) {
        return wrapper.data(null, "User does not have a shop")
    }

    data.shop_id = userShop.id
    delete data.user_id

    const result = await db.products.create({
        data: {
            ...data,
            product_types: {
                createMany: {
                    data: data.product_types
                }
            }
        }
    })

    return wrapper.data(result)
}

exports.getProducts = async (page, limit, search, category_id = null) => {

    const paginate = calcPaginate(page, limit)

    const condition = {
        OR:
            [
                {
                    name: {
                        contains: search
                    },
                },
                {
                    desc: {
                        contains: search
                    }
                }
            ],
    }
    if (category_id) {
        condition.category_id = category_id
    }

    const products = db.products.findMany({
        include: {
            category: true,
        },
        skip: paginate.skip,
        take: paginate.take,
        where: condition,
        
    })

    const totalItems = db.products.count({where: condition})

    const result = await Promise.all([products, totalItems])

    return wrapper.dataWithMeta(result[0], metaData(result[1], page, limit))
}

exports.getProductById = async (id) => {
    const result = await db.products.findUnique({
        where: {
            id: id
        },
        include: {
            category: true,
            product_types: true,
            shop: true
        }
    })
    return result ? wrapper.data(result) : wrapper.data(null, 'product not found')
}