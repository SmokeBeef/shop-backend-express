
exports.calcPaginate = (page, limit = 10) => {
    
    const offset = ((page || 1) - 1) * (limit || 10);

    return {
        skip: offset,
        offset,
        limit,
        take: limit
    }
}

exports.metaData = (totalItems, currentPage, itemsPerPage) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
        totalPage: totalPages,
        currentPage: currentPage,
        startItem: startItem,
        endItem: endItem,
        totalItems: totalItems,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage
    };
}