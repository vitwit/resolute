import Axios from 'axios';
import { convertPaginationToParams } from '../utils';

const groupByAdminURL = (admin) => `/cosmos/group/v1/groups_by_admin/${admin}`
const groupByMemberURL = (address) => `/cosmos/group/v1/groups_by_member/${address}`


const fetchGroupsByAdmin = (baseURL, admin, pagination) => {
    let uri = `${baseURL}${groupByAdminURL(admin)}`
    const pageParams = convertPaginationToParams(pagination)
    if (pageParams !== "") uri += `?${pageParams}`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}

const fetchGroupsByMember = (baseURL, address, pagination) => {
    let uri = `${baseURL}${groupByMemberURL(address)}`
    const pageParams = convertPaginationToParams(pagination)
    if (pageParams !== "") uri += `?${pageParams}`

    return Axios.get(uri, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
}

const result = {
    groupsByAdmin: fetchGroupsByAdmin,
    groupsByMember: fetchGroupsByMember,
}

export default result;