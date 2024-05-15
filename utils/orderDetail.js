exports.itemsToOrderDetail = (data) => {

    return data.map(item => {
        return {
            product_id: item.product_id,
            quantity: item.quantity,
            product_type_id: item.product_type_id,
            sub_total: item.value * item.quantity
        }
    })
}