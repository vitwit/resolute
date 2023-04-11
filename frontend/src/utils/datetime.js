import moment from 'moment/moment';

export function getLocalTime(value) {
    return moment(value).format("YYYY-MM-DD HH:m:s")
}

export function getFormatDate(value) {
    return `${moment(value).startOf('hour').fromNow()}`
}

export function getDaysLeft(end_date) {
    const end = moment(end_date,"YYYY-MM-DD")
    return end.diff(moment(), 'days') + 1
}