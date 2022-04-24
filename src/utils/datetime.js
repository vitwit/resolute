import moment from 'moment';

export function getLocalTime(value) {
    return moment(value).format("YYYY-MM-DD HH:m:s")
}