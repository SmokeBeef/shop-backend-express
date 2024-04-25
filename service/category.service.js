const { PrismaClient } = require("@prisma/client")
const wrapper = require('../utils/wrapper')
const { calcPaginate, metaData } = require("../utils/calcPaginate")

const db = new PrismaClient()

exports.createCategory = async (data) => {

    const isCategoryExist = await db.categories.findUnique({
        where: {
            name: data.name
        }
    })

    if (isCategoryExist)
        return wrapper.data(null, 'category already exists')

    const result = await db.categories.create({
        data
    })

    return wrapper.data(result, null);
}

exports.getTagById = async (id) => {

    const result = await db.categories.findUnique({
        where: {
            id
        },
        include: {
            products: {
                take: 10,
                orderBy: {
                    create_at: 'asc'
                }
            },
        }
    })

    return wrapper.data(result)
}

exports.getCategoriesPaginate = async (page, limit, search) => {

    const paginate = calcPaginate(page, limit);
    const categories = db.categories.findMany({
        skip: paginate.skip,
        take: paginate.take,
        where: {
            name: {
                contains: search
            }
        }
    })

    const totalItems = db.categories.count({
        where: {
            name: {
                contains: search
            }
        }
    })

    const result = await Promise.all([categories, totalItems])

    return wrapper.dataWithMeta(result[0], metaData(result[1], page, limit))
}