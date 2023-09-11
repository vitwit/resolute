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

//Removes the slashes('/') present at the end of url
export const getValidURL = (url) => {
    while(url?.length > 0 && url[url.length-1] === "/"){
        url = url.slice(0,url.length-1)
    }
    return url;
}