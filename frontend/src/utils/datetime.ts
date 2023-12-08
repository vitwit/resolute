import moment from 'moment/moment';

export function getDaysLeft(end_date: string): number {
    const end = moment(end_date,"YYYY-MM-DD")
    return end.diff(moment(), 'days') + 1
}