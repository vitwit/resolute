export const convertPaginationToParams = (pagination) => {
    let result = "";
    if (pagination === undefined || (pagination?.key === null && pagination?.limit === null) ||
        (pagination?.key === undefined && pagination?.limit === undefined)
    ) {
        return ""
    }
    if (pagination.key !== null) {
        result += `pagination.key=${encodeURIComponent(pagination.key)}`
        if (pagination.limit !== null) {
            result += `&pagination.limit=${pagination.limit}`
        }
    } else {
        if (pagination.limit !== null) {
            result += `pagination.limit=${pagination.limit}`
        }
    }

    return result
}

export const convertPaginationToParamsOffset = (pagination) => {
    let result = "";
    if (pagination === undefined || (pagination?.offset === null &&
        pagination?.limit === null) ||
        (pagination?.offset === undefined && pagination?.limit === undefined)
    ) {
        return ""
    }
    if (pagination.offset !== null) {
        result += `pagination.offset=${pagination.offset}`
        if (pagination.limit !== null) {
            result += `&pagination.limit=${pagination.limit}`
        }
    } else {
        if (pagination.limit !== null) {
            result += `pagination.limit=${pagination.limit}`
        }
    }

    return result
} 

// removes the trailing slashes from given url
export const cleanURL = (url) => {
    if(url?.length) {
        return url.replace(/\/+$/, '');
    }
    return ""
}