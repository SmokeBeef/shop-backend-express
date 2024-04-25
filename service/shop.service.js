const { PrismaClient } = require("@prisma/client");
const wrapper = require("../utils/wrapper");

const db = new PrismaClient()

exports.createShop = async (data) => {
    const isShopExist = await db.shops.findUnique({
        where: {
            user_id: data.user_id
        }
    })
    if (isShopExist) {
        return wrapper.data(null, "User already has a shop")
    }
    const result = await db.shops.create({
        data: data
    })
    return wrapper.data(result)
}


exports.getShopByUserId = async (userId) => {
    const result = await db.shops.findUnique({
        where: {
            user_id: userId
        },
        include: {
            products: true
        }
    })
    return wrapper.data(result)
}
